import { FormControl, InputGroup } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { useController } from 'react-hook-form'

const FileUpload = ({ name, acceptedFileTypes, control, renderChild, schema }) => {
  const inputRef = useRef()
  const {
    field: { ref, value, onChange, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules: { validate: schema.validateSync },
  })

  const children = renderChild({ click: () => inputRef.current.click(), image: value, error: invalid })
  useEffect(() => {}, [value])
  return (
    <FormControl isInvalid={invalid}>
      <InputGroup>
        <input
          type="file"
          accept={acceptedFileTypes}
          name={name}
          ref={inputRef}
          {...inputProps}
          inputRef={ref}
          style={{ display: 'none' }}
          onChange={(e) => onChange(e.target.files[0])}
        ></input>
        {children}
      </InputGroup>
    </FormControl>
  )
}

export default FileUpload
