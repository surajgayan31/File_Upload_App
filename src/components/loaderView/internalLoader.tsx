import { View, Text,ActivityIndicator } from 'react-native'
import React from 'react'

 
interface Props{
colors?:string
marginTop?:number
size?:'large'|'small'
}
const InternalLoader:React.FC<Props> = ({colors,marginTop,size}) => {
  return (
    <ActivityIndicator size={size??"small"} 
    color={colors??"#0000ff"}
    style={{marginTop:marginTop}}
    
    />
  )
}

export default InternalLoader