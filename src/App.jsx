import { useState, useEffect } from 'react'
import axios from 'axios'

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-4">{job.location}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{job.department}</span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </a>
      </div>
    </div>
  )
}

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      // Use our local backend server
      const response = await axios.get('http://localhost:3001/api/jobs')
      setJobs(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    // Fetch jobs every 5 minutes
    const interval = setInterval(fetchJobs, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={fetchJobs}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adobe Job Openings</h1>
        <p className="text-gray-600">Updated every 5 minutes</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center text-gray-600 py-12">
          No job openings found at the moment.
        </div>
      )}
    </div>
  )
}

export default App
