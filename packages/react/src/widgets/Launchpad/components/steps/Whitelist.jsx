import React from 'react'
import ContestTasks from '../ContestTasks'
import { useCreateContext } from '../../hooks/useCreateContext'

const Whitelist = () => {
  const { goToNext, modules, setModules } = useCreateContext()

  const addModule = (module) => {
    setModules((_modules) => [..._modules, module])
  }

  const editModule = (index, module) => {
    setModules((modules) => [...modules.slice(0, index), module, ...modules.slice(index + 1)])
  }

  const deleteModule = (index) => {
    setModules(() => [...modules.slice(0, index), ...modules.slice(index + 1)])
  }
  return (
    <ContestTasks
      modules={modules}
      addModule={addModule}
      deleteModule={deleteModule}
      editModule={editModule}
      proceed={goToNext}
    />
  )
}

export default Whitelist
