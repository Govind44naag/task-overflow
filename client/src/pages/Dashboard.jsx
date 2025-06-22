import React, { useCallback, useMemo, useState } from 'react'
import {WRAPPER,HEADER, ADD_BUTTON, STAT_CARD, ICON_WRAPPER, VALUE_CLASS,STATS_GRID,STATS, LABEL_CLASS, FILTER_LABELS, SELECT_CLASSES, FILTER_OPTIONS, TABS_WRAPPER, TAB_BASE, TAB_ACTIVE, TAB_INACTIVE, EMPTY_STATE} from '../assets/dummy'
import { CalendarIcon, Filter,  HomeIcon, Plus  } from 'lucide-react'
import {useOutletContext} from  'react-router-dom'
import axios from 'axios'
import TaskModel from '../components/TaskModel'
import TaskItem from '../components/TaskItem'
import { API_TASK } from '../utils/config'

const Dashboard = () => {
  const {tasks,refreshTasks}=useOutletContext()
  const [showModel,setShowModel]=useState(false)
  const [selectedTasks,setSelectedTasks]=useState(null)
  const [filter,setFilter]=useState("all")

  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
    completed: tasks.filter(
      t =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length,
  }), [tasks]);

  // ✅ Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate); // typo fixed from `durDate`
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (filter) {
        case 'today':
          return dueDate.toDateString() === today.toDateString();
        case 'week':
          return dueDate >= today && dueDate <= nextWeek;
        case 'high':
        case 'medium':
        case 'low':
          return task.priority?.toLowerCase() === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  
   //saving tasks
   const handleTaskSave=useCallback(async (taskData)=>{
    try{
      if(taskData.id) await axios.put(`${API_TASK}/${taskData.id}/gp`,taskData)
        refreshTasks()
      setShowModel(false)
      setSelectedTasks(null)
     }
    catch(error){
      console.error("Error saving tasks:",error)
    }
   },[refreshTasks])
   
   
   return (
    <div className={WRAPPER}>
      {/*Wrapper*/}
      <div className={HEADER}>
        <div className='min-w-0'>
          <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <HomeIcon className='text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0'/>
            <span className='truncate'>Task Overview</span></h1>
            <span className='text-sm text-gray-500 mt-1 ml-7 truncate'>Manage your tasks efficiently</span>
          
        </div>
        <button onClick={()=>setShowModel(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>
      {/*stats*/}
      <div className={STATS_GRID}>
        {STATS.map(({
          key,label,icon:Icon,iconColor="border-purple-100",
          valueKey,textColor,gradient,borderColor,
        })=>(
          <div key={key} className={`${STAT_CARD} ${borderColor}`}>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className='w-4 h-4 md:w-5 md:h-5'/>
                </div>
                <div className='min-w-0'>
                  <p className={`${VALUE_CLASS} ${gradient ?
                    "bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent"
                    :textColor
                  }`} >{stats[valueKey]}</p>
                  <p className={LABEL_CLASS}>{label}</p>
                  </div>
                </div>

          </div>
        ))}
      </div>
      <div className='space-y-6'>
      {/*filter*/}
      <div className='flex items-center gap-2 min-w-0'>
        <Filter className='w-5 h-5 text-purple-500 shrink-0'/>
        <h2 className='text-base md:text-lg font-semibold text-gray-800 truncate'>
          {FILTER_LABELS[filter]}
        </h2>
        </div>
        <select value={filter} onChange={(e)=>setFilter(e.target.value)}
          className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map(opt=><option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>)}
          </select>
          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt=>(
              <button key={opt} onClick={()=>setFilter(opt)} className={`${TAB_BASE} ${filter === opt ?
                TAB_ACTIVE : TAB_INACTIVE}`} >          
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
</button>
              
            ))}
          </div>
      </div>
      {/*task list*/}
      <div className='space-y-4'>
        {filteredTasks.length===0 ? (
          <div className={EMPTY_STATE.wrapper}>
            <div className={EMPTY_STATE.iconWrapper}>
              <CalendarIcon className='w-8 h-8 text-purple-500'/>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                No tasks found
              </h3>
              <p className='text-sm text-gray-500 mb-4'>{filter==='all' ? 
              "Create your first task toget started" :"No tasks match this filter"}</p>
              <button onClick={()=>setShowModel(true)} className={EMPTY_STATE.btn}>Add New Task</button>
          
            </div>
        ) : (
          filteredTasks.map(task=>(
            <TaskItem key={task._id || task.id } task={task}
            onRefresh={refreshTasks}
            showCompleteCheckbox
            onEdit={()=>{setSelectedTasks(task); setShowModel(true)}} 
            
            />

          ))
        )}
        {/* add task desktop*/}
        <div onClick={()=>setShowModel(true)} className='hidden md:flex items-center justify-center p-4 border-2 border-dashed border-purple-200
        rounded-xl hover:border-purple-50/50 cursor-pointer transition-colors'>
          <Plus className='w-5 h-5 text-purple-500 mr-2'/>
          <span className='text-gray-600 font-medium'>Add New Tasks</span>
        </div>
      </div>
      {/*Model*/}
      <TaskModel isOpen={showModel || !!selectedTasks} 
      onClose={()=>{setShowModel(false); setSelectedTasks(null)}}
      taskToEdit={selectedTasks}
      onSave={handleTaskSave}/>
      </div>
    
  )
}

export default Dashboard
