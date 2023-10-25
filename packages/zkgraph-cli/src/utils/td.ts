import fs from 'node:fs'
import FormData from 'form-data'
import axios from 'axios'
import axiosRetry from 'axios-retry'

import { ethers } from 'ethers'
import { TdABI, TdConfig } from '../constants'

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount: number) => {
    return retryCount * 1000
  },
})

export function getDispatcherContract(userPrivateKey: string) {
  const provider = new ethers.providers.JsonRpcProvider(TdConfig.providerUrl)
  const signer = new ethers.Wallet(userPrivateKey, provider)

  const dispatcherContract = new ethers.Contract(
    TdConfig.contract,
    TdABI,
    provider,
  ).connect(signer)

  return dispatcherContract
}

export async function queryTaskId(txhash: string) {
  const response = await axios.get(
    `${TdConfig.queryrApi}/task?txhash=${txhash}`,
  )
  const taskId = response.data.task.id
  return taskId
}

export async function uploadWasmToTd(wasmPath: string) {
  const data = new FormData()
  data.append('file', fs.createReadStream(wasmPath))

  const requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${TdConfig.queryrApi}/upload`,
    headers: {
      ...data.getHeaders(),
    },
    data,
  }

  const response = await axios.request(requestConfig).catch((error) => {
    throw error
  })

  return response.data.filename
}
