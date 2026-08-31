import api from '../api/axios'

export async function getApplication(){
    const response = await api.get("/application")

    return response.data
}

export async function getApplications(id){
    const response = await api.get(`/application/${id}`)

    return response.data
}

export async function createApplication(applicationData){
    const response = await api.post('/application' , applicationData)

    return response.data
}

export async function updateApplication(id , applicationData){
    const response = await api.patch(
        `/application/${id}`,
        applicationData
    )

    return response.data
}

export async function deleteApplication(id){
    const response = await api.delete(
        `/application/${id}`
    )

    return response.data
}