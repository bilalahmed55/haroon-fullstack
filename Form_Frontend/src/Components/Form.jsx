import { useState } from "react"
import axios from "axios"

function Form() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
    })

    const [id, setId] = useState("")
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8000/api/records', formData)

            setMessage(`Record created with ID: ${response.data.data._id}`)
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
            })
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
        }
    }

    const handleGet = async () => {
        if (!id) {
            setMessage("Please enter an ID")
            return
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/records/${id}`)
            const recordData = response.data.data

            setFormData({
                name: recordData.name,
                email: recordData.email,
                phoneNumber: recordData.phoneNumber,
            })
            setMessage("Record retrieved successfully")
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
        }
    }

    const handleUpdate = async () => {
        if (!id) {
            setMessage("Please enter an ID")
            return
        }

        try {
            await axios.put(`http://localhost:8000/api/records/${id}`, formData)

            setMessage("Record updated successfully")
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
        }
    }

    const handleDelete = async () => {
        if (!id) {
            setMessage("Please enter an ID")
            return
        }

        try {
            await axios.delete(`http://localhost:8000/api/records/${id}`)

            setMessage("Record deleted successfully")
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
            })
            setId("")
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
        }
    }

    const clearForm = () => {
        setFormData({
            name: "",
            email: "",
            phoneNumber: "",
        })
        setId("")
        setMessage("")
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Simple Form</h2>

            {message && (
                <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded text-blue-800">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email:
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number:
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                </div>
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={clearForm}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Clear
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-3">Record Actions</h3>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID:
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleGet}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Get
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Update
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form