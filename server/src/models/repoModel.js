import mongoose from "./indexModel.js";

const repoSchema = new mongoose.Schema({
    name : {
        type : String,
        required :  false
    },
    url : {
        type : String,
        required :  false
    },
    description : {
        type : String,
        required :  false
    },
    stars:{
        type: Number,
        required: false
    },
    language:{
        type: String,
        required: false
    }
},
{ timestamps : true },
{ collection : 'repos' })

const RepoModel = mongoose.model("repos",repoSchema)

export default RepoModel