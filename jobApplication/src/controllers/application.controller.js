const mongoose = require('mongoose')
const jobApplicationModel = require('../models/jobApplication.model')

const createApplication = async (req , res)=>{
    try {
        const {company , title , status , type , location , notes , appliedAt} = req.body

    if(!company || !title){
        return res.status(400).json({
            message : "Company and title are required"
        })
    }

    const application = await jobApplicationModel.create({
        userId : req.user.id,
        company,
        title, 
        status,
        type,
        location,
        notes,
        appliedAt
    })

    return res.status(201).json({
        message : "application created",
        application
    })
    } catch (error) {
       return res.status(500).json({
      message: "Failed to create application",
    });
    }
}

const getApplication = async(req,res)=>{
    try {
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message : "invalid application id"
            })
        }

        const application = await jobApplicationModel.findOne({
            _id : id,
            userId : req.user.id
        })

        if(!application){
            return res.status(404).json({
                message : "Application not found"
            })
        }

        return res.status(200).json({
            message : "application gotted",
            application
        })

    } catch (error) {
        return res.status(500).json({
        message: "Failed to fetch application",
    });

    }
}

const getApplications = async(req,res)=>{
  try {
    const {
      page = 1,
      limit = 10,
      company,
      title,
      status,
      type,
      location
    } = req.query

    const filter = {
        userId: req.user.id
    }

    if(company){
        filter.company = {
            $regex : company,
            $options : "i"
        }
    }

    if(title){
        filter.title = {
            $regex : title,
            $options : "i"
        }
    }

    if(status){
      filter.status = status
    }

    if(type){
        filter.type = type
    }

    if(location){
        filter.location = {
            $regex: location,
            $options : "i"
        }
    }

    const skip = (page - 1) * limit

    const application = await jobApplicationModel
    .find(filter)
    .sort({createdAt : -1})
    .skip(skip)
    .limit(Number(limit))

    const total = await jobApplicationModel.countDocuments(filter)

    res.json({
        application,
        page: Number(page),
        limit : Number(limit),
        total,
        totalPages: Math.ceil(total/limit)
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

const updateApplication = async(req,res)=>{
    try {
        const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            message : "invalid application id"
        })
    }

    const allowedFields = [
        "company",
        "title",
        "status",
        "type",
        "location",
        "notes",
        "appliedAt"
    ]

    const updates = {}

    for(const field of allowedFields){
        if(req.body[field] !== undefined){
            updates[field] = req.body[field]
        }
    }

    const application = await jobApplicationModel.findOneAndUpdate(
        {
            _id : id,
            userId : req.user.id
        },
        updates,
        {
            new : true,
            runValidators : true
        }
    )

    if(!application){
        return res.status(404).json({
            message : "application not found"
        })
    }

    return res.status(200).json({
        message : "Application updated",
        application
    })
    } catch (error) {
          return res.status(500).json({
          message: "Failed to update application",
    });
    }

}

const deleteApplication = async(req,res)=>{
    try {
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "invalid application Id"
            })
        }

        const application = await jobApplicationModel.findOneAndDelete(
            {
                _id : id,
                userId : req.user.id
            }
        )

        if(!application){
            return res.status(404).json({
            message : "application not found"
        })
        }

        return res.status(200).json({
      message: "Application deleted",
      });

    } catch (error) {
          return res.status(500).json({
          message: "Failed to delete application",
    });
    }
}

module.exports = {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication
}
