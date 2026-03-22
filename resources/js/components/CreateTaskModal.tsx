import React, { useState } from "react";
import type { CreateTaskData } from "@/types";
import { on } from "events";
import { router } from '@inertiajs/react';


//PROPS (parameters passed to the component)
interface CreateTaskModalProps {
    isOpen: boolean; //whether the modal is open or not
    onClose: () => void;    //function to close the modal
    onTaskCreated: () => void; //function to call when a task is created
    selectedDate: string; //date slected in the calendar
}

export default function CreateTaskModal({ 
    isOpen, 
    onClose, 
    onTaskCreated, 
    selectedDate 
}: CreateTaskModalProps) {

//STATES

    const [loading, setLoading] = useState(false); //loading state for form submission

    const [error, setError] = useState<string | null>(null); //error state for form submission

    //State for storing form data, initialized with default values.
    const [formData, setFormData] = useState<CreateTaskData>({
        title: "",
        description: "",
        due_date: selectedDate || new Date().toISOString().split("T")[0], //default to selected date or current day
        status: "pending",
        priority: "medium",
        source_type: "personal",
    }); //state to hold form data

    //FUNCTIONS
    
    //Function to handle changes in form inputs, updates the formData state accordingly.
    const handleChange = 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        //update the changed field 
        setFormData((prev) => 
                    ({ ...prev, //copy the rest of the form data (previous state)
                        [name]: value //update the name fild if changed
        })); 
    };

    //Function to handle form submission, sends a POST request to create a new task.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //prevent default form submission behavior
        setLoading(true); //set loading state to true while submitting
        setError(null); //reset any previous errors

        try{
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ''; //get CSRF token from meta tag  

            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '', //include CSRF token in the request headers
                },
                credentials: 'same-origin', //include cookies in the request
                body: JSON.stringify(formData), //send form data as JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred while creating the task.');
            }

            setFormData({
                title: "",
                description: "",
                due_date: selectedDate || new Date().toISOString().split("T")[0],
                status: "pending",
                priority: "medium",
                source_type: "personal",
            });

            onTaskCreated(); //call the onTaskCreated callback to refresh the task list
            onClose(); //close the modal

        } catch (error) {
            console.error("Error creating task:", error);
            setError(error instanceof Error ? error.message : "An error occurred while creating the task. Please try again.");
            }finally {
                setLoading(false); //set loading state to false after submission is complete
        }
    }
    
    //     router.post('/tasks', { ...formData}, {
    //     onSuccess: () => {
    //         setFormData({
    //             title: "",
    //             description: "",
    //             due_date: selectedDate || new Date().toISOString().split("T")[0],
    //             status: "pending",
    //             priority: "medium",
    //             source_type: "personal",
    //         });
    //         onTaskCreated();
    //         onClose();
    //     },
    //     onError: (errors) => {
    //         console.error("Error creating task:", errors);
    //         setError("An error occurred while creating the task. Please try again.");
    //     },
    //     onFinish: () => {
    //         setLoading(false);
    //     },
    // });


    //RENDER
    if (!isOpen) return null; //if modal is not open, render nothing
    
    return (
        // Modal overlay
        <div //lack background and blur effect for the modal
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose} //close modal when clicking outside of it
            
        >
            {/* Modal content */}
            <div 
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md p-6 relative-fade-in"
                onClick={(e) => e.stopPropagation()} //prevent closing modal when clicking inside of it
            >
                {/*HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Nueva Tarea
                    </h2>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Display error message if there is an error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Title input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Título *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition focus:borer-transparent placeholder-gray-400 text-gray-900"
                            placeholder="Ej: Examen HCI"
                            
                        />
                    </div>

                    {/*Date field */}
                    <div>
                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha *
                        </label>
                        <input
                            type="date"
                            id="due_date"
                            name="due_date"
                            required
                            value={formData.due_date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-transparent text-gray-900"  
                        />
                    </div>

                    {/* Priority field */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridad *
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            required
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-transparent text-gray-900 bg-white"
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    
                    {/* Description field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:borer-transparent resize-none placeholder-gray-400 text-gray-900"
                            placeholder="Detalles de la tarea..."
                        />
                    </div>  

                    {/* Submit button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
                        >  
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={loading} //disable button while loading
                            className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={handleSubmit}
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>  
        </div>
    );
}        
            