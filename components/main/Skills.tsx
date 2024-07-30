import { Backend_skill, Frontend_skill, Full_stack, Other_skill } from '@/constants'
import React from 'react'
import SkillsDataProvider from '../sub/SkillsDataProvider'
import SkillText from '../sub/SkillText'

const Skills = () => {
  return (
    <section
      className='flex flex-col items-center justify-center gap-3 h-full relatives overflow-hidden pb-80 py-20'
      id='skills'
      style={{ transform: "scale(0.9)" }}
    >

      <SkillText />

      <div className='flex flex-row justify-around flex-wrap m-4 gap-5 items-center'>
        {Frontend_skill.map((image, index) => (
          <SkillsDataProvider
            key={index}
            src={image.Image}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>

      <div className='flex flex-row justify-around flex-wrap m-4 gap-5 items-center'>
        {Backend_skill.map((image, index) => (
          <SkillsDataProvider
            key={index}
            src={image.Image}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>

      <div className='flex flex-row justify-around flex-wrap m-4 gap-5 items-center'>
        {Full_stack.map((image, index) => (
          <SkillsDataProvider
            key={index}
            src={image.Image}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>

      <div className='flex flex-row justify-around flex-wrap m-4 gap-5 items-center'>
        {Other_skill.map((image, index) => (
          <SkillsDataProvider
            key={index}
            src={image.Image}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>

      <div className='w-full h-full absolute'>
        <div className='w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover'>
          <video
            className='w-full h-auto'
            preload='false'
            playsInline
            loop
            muted
            autoPlay
            src='/cards-video.webm'
          />
        </div>
      </div>
    </section>
  )
}

export default Skills