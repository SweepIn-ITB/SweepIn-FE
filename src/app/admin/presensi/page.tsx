'use client'

// Hooks
// import { useFetch } from '@/hooks/useFetch';
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'

// Components
import Header from '@/components/AdminHeader'
import ListContainer from '@/components/sections/AdminAttendanceListContainer'
import Sidebar from '@/components/Sidebar'

// Interface
import type User from '@/interface/User'
import Attendance from '@/interface/AdminAttendanceCard'

const User = (): JSX.Element => {
  const { data: session } = useSession()

  // Query params
  const searchParams = useSearchParams()

  // Pagination
  const [count, setCount] = useState<number[]>([])
  const itemsPerPage = 10
  const page = Number(searchParams.get('page')) || 1

  // Name search
  const name = searchParams.get('name') || ''

  // Location search
  const location = searchParams.get('location') || ''

  // Role search
  const role = searchParams.get('role') || ''

  // User data
  const [user, setUser] = useState<User | null>(null)

  // Date search
  const startDate = searchParams.get('start_date') || ''
  const endDate = searchParams.get('end_date') || ''

  // Fetch data
  const [data, setData] = useState<Attendance[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Set user data from session
  useEffect(() => {
    if (session) {
      setUser(session.user as User)
    }
  }, [session])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (user?.id) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/attendance?page=${page}&per_page=${itemsPerPage}&user=${name}${location && location != 'Semua Lokasi' ? `&location=${location}` : ''}${role && role != 'Semua Role' ? `&role=${role}` : ''}${startDate && endDate ? `&start_date=${startDate}&end_date=${endDate}` : ''}`
          )
          setData(response.data.data.attendance)
          setCount([response.data.data.filtered, itemsPerPage, response.data.data.total])
        }
      } catch (error) {
        console.error(error)
        setData([])
        setCount([0, itemsPerPage, 0])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [location, name, page, role, user?.id, startDate, endDate])

  return (
    <div className="flex flex-row-reverse w-screen h-screen">
      <div className="w-full flex flex-col items-center bg-white">
        {/* Header */}
        <div className="w-11/12">
          <Header title="Daftar Presensi"/>

          {/* Body */}
          <ListContainer data={data as Attendance[]} count={count} loading={loading} />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar active='attendance'/>
    </div>
  )
}

export default User
