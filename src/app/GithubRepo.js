"use client";
import {useState,useEffect} from 'react';
import {MdDelete} from 'react-icons/md'
import {BiEdit} from 'react-icons/bi'
import { Octokit } from 'octokit';
import EditPopup from './EditModel'
import Image from 'next/image';

const GITHUB_TOKEN = "..."
const GITHUB_USERNAME = "..."

function githubAuth() {
  const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
  ]
  const [repos,setRepos] = useState()
  const [editModal,setEditModal] = useState(false)
  const [repoNewName,setRepoNewName] = useState('')
  const [repoOldInfo,setRepoOldInfo] = useState()

      const getRepos = async () => {
        const octokit = new Octokit({
          auth: `${GITHUB_TOKEN}`
        })
        
        const AllRepos = await octokit.request(`GET /users/${GITHUB_USERNAME}/repos`, {
          owner: `${GITHUB_USERNAME}`,
          repo: 'repos',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }).then((res)=>{
          setRepos(res.data)
        }).catch((error)=>{
          console.log(error,"error")
        })
      }

      useEffect(()=>{
        getRepos()
      },[])

      const handleDelete = async(repoName, repoOwner) => {
        const octokit = new Octokit({
          auth: `${GITHUB_TOKEN}`
        })
        
        const Delete = await octokit.request(`DELETE /repos/${repoOwner}/${repoName}`, {
          owner: `${repoOwner}`,
          repo: `${repoName}`,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }).then((res)=>{
          getRepos()
        })
      }

      const handleEdit = async(repoData) => {
        setRepoOldInfo(repoData)
        setEditModal(true)
      }

      const handleUpdate = async() => {
        const octokit = new Octokit({
          auth: `${GITHUB_TOKEN}`
        })
          if(repoNewName !== ""){
             await octokit.request(`PATCH /repos/${repoOldInfo.owner.login}/${repoOldInfo.name}`, {
              owner: `${repoOldInfo.owner.login}`,
              repo: 'REPO',
              name: `${repoNewName}`,
              description: 'This is your first repository',
              homepage: 'https://github.com',
              'public': true,
              has_issues: true,
              has_projects: true,
              has_wiki: true,
              headers: {
                'X-GitHub-Api-Version': '2022-11-28'
              }
            }).then((res)=>{
              console.log(res,"res")
              getRepos()
            }).catch((error)=>{
              console.log(error,"error")
            })
          }
      }

      useEffect(()=>{
        handleUpdate()
      },[repoNewName])

  return (
    <div className="w-full">
      {editModal == true ? (
        <div>
        <EditPopup openModal={editModal} setOpenModal={setEditModal} newRepoInfo={setRepoNewName} repoOldInfo={repoOldInfo}/>
        </div>
      ):(
        <div className='flex justify-center'>
         <div className="px-4 sm:px-6 lg:px-8 lg:w-[40%] w-[80%]">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                {repos && repos.length > 0 ? (
                  <>
                  <Image
      src="/Images/gitHubLogo.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
                  <table className="min-w-full divide-y divide-black mt-10">
                  <thead className='bg-black'>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                        Repo Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Owner Name
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {repos && repos.map((data,index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {data.full_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{data.owner.login}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-lg font-medium sm:pr-0">
                          <BiEdit className='cursor-pointer' onClick={()=>{handleEdit(data)}}/>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-lg font-medium sm:pr-0">
                          <MdDelete className='cursor-pointer' onClick={()=>{handleDelete(data.name,data.owner.login)}}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </>
                ):(
                  <div className='flex justify-center items-center h-screen'>
                  <Image
      src="/Images/noDataFound.webp"
      width={500}
      height={500}
      alt="Picture of the author"
    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

export default githubAuth