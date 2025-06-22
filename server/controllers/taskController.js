import Task from "../model/taskModel.js"
import { zodCreateTask } from "../model/zodModel.js"

 
export const createTask=async (req,res)=>{
    try{
            const response=zodCreateTask.safeParse(req.body)
            if(!response.success){
                return res.status(401).json({
                    success:false,
                    message:"Input is not valid",
                })
            }
            const {title,description,priority,dueDate,completed}=req.body
           
            const task = new Task({
                title,
                description,
                priority,
                dueDate,
                completed:completed==='Yes' || completed===true,
                owner:req.user.id
            })
            const saved=await task.save()
            res.status(201).json({
                success:true,
                task:saved
            })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

//Get all task
export const getTasks=async (req,res)=>{
    try{
        
    const tasks=await Task.find({owner:req.user.id}).sort({createAt:-1})
    res.json({
        success:true,
        tasks,
    })
}
catch(err){
    res.status(500).json({
        success:false,
        message:err.message,
    })
}
}

//Get single task by id (must belong to perticular user)
export const getTaskById=async (req,res)=>{
    try{
    const task=await Task.findOne({_id:req.params.id,owner:req.user.id})
    if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found!",
        })
    }
    res.json({success:true,task})
}
catch(err){
    res.status(500).json({
        success:false,
        message:err.message,
    })
}
}

//Update task by id
// Update task by ID
export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };

        // Normalize completed value
        if (data.completed !== undefined) {
            data.completed = data.completed === 'Yes' || data.completed === true;
        }

        // Find and update the task
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true, runValidators: true }
        );

        // If task not found or not owned by user
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Task not found or not yours"
            });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updated
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete task
export const deleteTask = async (req, res) => {
    try {
        // Fixed typo: TaskfindOneAndDelete → Task.findOneAndDelete
        // Also fixed typo: onwer → owner
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Task not found or not yours"
            });
        }

        return res.json({
            success: true,
            message: "Task deleted successfully!"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
