import {z } from 'zod'

export const zEnv = z.object({
    VITE_PROXY_URL : z.string().trim().min(1),

})


export const env = zEnv.parse(import.meta.env)