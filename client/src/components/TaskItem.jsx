import React, { useEffect, useState } from 'react'
import { getPriorityBadgeColor, MENU_OPTIONS, TI_CLASSES } from '../assets/dummy'
import { Calendar, CheckCircle, Clock, MoreVertical } from 'lucide-react'
import axios from 'axios'
import {format, isToday} from 'date-fns'
import TaskModel from './TaskModel'
import { API_TASK } from '../utils/config'

 
const TaskItem = ({task, onRefresh,onLogout,showCompleteCheckbox=true}) => {
 
  const [showMenu,setShowMenu]=useState(false)
const [isCompleted, setIsCompleted] = useState(() =>
  [true, 1, 'yes'].includes(
    typeof task?.completed === 'string'
      ? task?.completed.toLowerCase()
      : task?.completed
  )
)



  const [showEditModel,setShowEditModel]=useState(false)
  const [subtasks,setSubTasks]=useState(task?.subtasks || [])

  useEffect(()=>{
    setIsCompleted(
      [true,1,'yes'].includes(
        typeof task.completed==='string' ? task.completed.toLowerCase() :task.completed
      )
    )
  },[task?.completed])

  const getAuthHeaders=()=>{
    const token=localStorage.getItem('token')
    if(!token) throw new Error("No auth token found")
    return {Authorization :`Bearer ${token}`}
  }

  const borderColor=isCompleted ? "border-green-500" :getPriorityBadgeColor(task.priority).split(" ")[0]
  const handleComplete=async ()=>{
    const newStatus=isCompleted ? 'No': 'Yes'
    try{
      await axios.put(`${API_TASK}/${task._id}/gp`,{completed:newStatus},
        {headers:getAuthHeaders() })

   setIsCompleted(!isCompleted)
    onRefresh?.()
   }
   catch(err){
    console.error(err)
    if(err.message?.status===401) onLogout?.()
   }
    
  
}
  
const handleAction=(action)=>{
  setShowMenu(false)
  if(action==='edit') setShowEditModel(true)
    if(action==='delete') handleDelete()
}

const handleDelete=async()=>{
  try{
    await axios.delete(`${API_TASK}/${task._id}/gp` , {headers:getAuthHeaders()})
    onRefresh?.()
  }
  catch(err){

    if(err.response?.status===401) onLogout?.()
  }
}

const handleSave=async (updatedTask)=>{
  try{
    const payload=(({title,description,priority,dueDate,completed})=>
    ({title,description,priority,dueDate,completed}))(updatedTask)
  axios.put(`${API_TASK}${task._id}/gp`,payload,
    {headers:getAuthHeaders()}
  )
  setShowEditModel(false)
  onRefresh?.()
  }
  catch(err){
if(err.response?.status===401) onLogout?.()
  }
}
const progress=subtasks.length ?(subtasks.filter(st=>st.completed).length/subtasks.length)*100:0


  return (
    <>
    <div className={`${TI_CLASSES.wrapper} ${borderColor} flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4`}>
  {/* LEFT */}
  <div className={`${TI_CLASSES.leftContainer} flex flex-1 flex-col sm:flex-row sm:items-start gap-2 sm:gap-4`}>
    {/* Complete Checkbox */}
    {showCompleteCheckbox && (
      <button
        onClick={handleComplete}
        className={`${TI_CLASSES.completeBtn} ${isCompleted ? 'text-green-500' : 'text-gray-300'}`}
      >
        <CheckCircle
          size={18}
          className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? 'fill-green-500' : ''}`}
        />
      </button>
    )}

    {/* Title + Description */}
    <div className='flex-1 min-w-0'>
      <div className='flex flex-wrap items-baseline gap-1 sm:gap-2 mb-1'>
        <h3
          className={`${TI_CLASSES.titleBase} break-words text-base sm:text-lg ${
            isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`${TI_CLASSES.priorityBadge} text-xs sm:text-sm ${getPriorityBadgeColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className={`${TI_CLASSES.description} text-xs sm:text-sm text-gray-600 break-words`}>
          {task.description}
        </p>
      )}
    </div>
  </div>

  {/* RIGHT */}
  <div className={`${TI_CLASSES.rightContainer} flex justify-between sm:justify-end items-start gap-2`}>
    {/* MENU BUTTON */}
    <div className='relative'>
      <button onClick={() => setShowMenu(!showMenu)} className={TI_CLASSES.menuButton}>
        <MoreVertical className='w-4 h-4 sm:w-5 sm:h-5' />
      </button>
      {showMenu && (
        <div className={`${TI_CLASSES.menuDropdown} z-50`}>
          {MENU_OPTIONS.map((opt) => (
            <button
              key={opt.action}
              onClick={() => handleAction(opt.action)}
              className='w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200'
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Dates */}
    <div className='flex flex-col gap-1 text-xs sm:text-sm text-right whitespace-nowrap'>
      <div
        className={`${TI_CLASSES.dateRow} ${
          task.dueDate && isToday(new Date(task.dueDate)) ? 'text-fuchsia-600' : 'text-gray-500'
        } flex items-center gap-1`}
      >
        <Calendar className='w-3.5 h-3.5' />
        {task.dueDate
          ? isToday(new Date(task.dueDate))
            ? 'Today'
            : format(new Date(task.dueDate), 'MMM dd')
          : '-'}
      </div>
      <div className={`${TI_CLASSES.createdRow} flex items-center gap-1 text-gray-400`}>
        <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
        {task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd')}` : 'No date'}
      </div>
    </div>
  </div>
</div>

     <TaskModel isOpen={showEditModel}
     onClose={()=>setShowEditModel(false)}
     taskToEdit={task}
     onSave={handleSave} />
    </>
  )
}

export default TaskItem
