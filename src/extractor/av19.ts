import axios from 'axios'
import { download } from 'node-hls-downloader'
import { outDir } from '../../config.json'
import path from 'path'
import fs from 'fs'

async function fetch(url: string): Promise<any> {
    const headers = { referer: 'https://david.cdnbuzz.buzz/' }
    const { data, status } = await axios.get(url, { headers })

    if (status !== 200)
        throw new Error(`Error ${status}`)

    return data
}

async function getM3u8URI(url: string) {

    const body = await fetch(url)
    const reg = /vvv=([\/\w]+)[^"]+n=([^"]+)/

    if (reg.exec(body))
        return {
            uri: `https://124fdsf6dsf.onymyway.top/cupcup8/${RegExp.$1}.mp4/index.js`,
            dir: path.join(outDir, `${RegExp.$2}.mp4`),
            name: RegExp.$2
        }
    else
        throw new Error('failed to extract m3u8')
}

export default async (url: string) => {
    try {
        const m3u8 = await getM3u8URI(url);

        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, {
                recursive: true
            });
        }

        await download({
            quality: 'best',
            concurrency: 5,
            outputFile: m3u8.dir,
            streamUrl: encodeURI(m3u8.uri),
            httpHeaders: {
                referer: 'https://david.cdnbuzz.buzz/'
            },
    //        logger: {
    //            // Use an empty function to suppress logs
    //            log: () => {},
    //            error: console.error, // Log errors only
    //        },
        });

    } catch (error: any) {
        console.error(`Error: ${(error as Error).message}`);
    }
};