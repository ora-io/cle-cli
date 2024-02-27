import fs from 'node:fs'
import FormData from 'form-data'
import axios from 'axios'
import axiosRetry from 'axios-retry'

import { ethers } from 'ethers'
import { TaskDispatch } from '@ora-io/cle-api'
import { TdConfig } from '../constants'

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount: number) => {
    return retryCount * 1000
  },
})

export function getDispatcher(userPrivateKey: string) {
  const provider = new ethers.providers.JsonRpcProvider(TdConfig.providerUrl)
  const signer = new ethers.Wallet(userPrivateKey, provider)
  const feeInWei = ethers.utils.parseEther(TdConfig.fee)
  const dispatcher = new TaskDispatch(TdConfig.queryrApi, TdConfig.contract, feeInWei, provider, signer)

  return dispatcher
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
