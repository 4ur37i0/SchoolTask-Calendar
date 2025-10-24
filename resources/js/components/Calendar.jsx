import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Toaster, toast } from 'react-hot-toast';
import dayjs from 'dayjs';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [details, setDetails] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [taskDetails, setTasksDetails] = useState({
    title: '',
    date: '',
    courseName: '',
    type: '',
    status: ''
  });

  const loadTasks = async () => {
    try {
      const res = await fetch('/tasks');
      const data = await res.json();

      setEvents(
        data.map(task => ({
          title: task.title,
          start: task.due_date,
          backgroundColor: task.color_rgb|| '#3B82F6', 
          borderColor: setBorderColor(task.status) || '#3B82F6',
          textColor: '#fff',
          extendedProps: {
            course: task.course,
            status: task.status,
          },
        }))
      );
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  const setBorderColor = (state) => {
    return state != 'atrasado' ? 
     '#7a727231'
    : '#fa0000ff';
  }

  const calculateNextStatus = (currentStatus, dueDate) => {
    const now = dayjs();
    const taskDueDate = dayjs(dueDate);
    switch (currentStatus) {
      case 'atrasado':
      case 'pendiente':
        return 'hecho';
      case 'hecho':
        if (now.isBefore(taskDueDate)) {
          return 'pendiente';
        } else {
          return 'atrasado';
        }
      default:
        return currentStatus;
    }
  };

  const viewDetails =  (info) => {
    setDetails(true)
    setTasksDetails({
      title: info.title,
      date: info.startStr,
      course: info.extendedProps.course,
      status: info.extendedProps.status,
    });
    setNextStatus(calculateNextStatus(info.extendedProps.status, info.startStr).toUpperCase())
  }

  const closeDetails = () => {
    setDetails(false)
    setTasksDetails({
      title: "",
      date: "",
      course: "",
      status: "",
    });
  }

  const changeStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/tasks/changeStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(taskDetails)
      });
      const msg = await res.json();

      if (res.ok) {
        toast.success(`Estado cambiado a ${msg.newStatus.toUpperCase()}`);
      } else {
        toast.error(`Error al cambiar el estado: ${msg.error}`);
      }
    } catch (err) {
      toast.error(`Error de conexión con el servidor: ${err}`);
    }
    closeDetails()
    loadTasks()
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          locale={esLocale}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          dayMaxEventRows={true}
          eventDisplay="block"
          eventClick={(info) => viewDetails(info.event)}
          eventDidMount={(info) => {
            const { status } = info.event.extendedProps;
            if (status === 'hecho') {
              info.el.classList.add('opacity-30', 'blur-[1px]');
            }else if (status === 'atrasado') {
              info.el.classList.add('opacity-70');
            }
          }}
        />

        {details && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4"
            onClick={() => setDetails(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                {taskDetails.title}
              </h2>

              <p className="text-gray-600 text-center mb-4">
                {taskDetails.course}
              </p>

              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">Fecha de entrega:</span>
                <span className="text-gray-800">
                  {taskDetails.date}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-gray-700">Estado:</span>
                <span
                  className={`font-bold ${
                    taskDetails.status === 'hecho' 
                      ? 'text-green-500'
                      : taskDetails.status === 'pendiente'
                      ? 'text-grey-500'
                      : 'text-red-500'
                  }`}
                >
                  {taskDetails.status.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDetails}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={changeStatus}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Cambiar a {nextStatus}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;