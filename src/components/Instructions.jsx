import React from 'react'

const Instructions = (step, no_) => {
  return (
    <article className="flex justify-start items-center gap-5">
      <div>{no_}</div>
      <p className="text-blue font-semibold text-sm">{step}</p>
    </article>
  )
}

export default Instructions