import { json } from "@sveltejs/kit"
import * as fs from 'fs'
import { parse } from "$lib/parsing/parser";


export async function GET() {
    const dir = '../modules/projects/';
    let paths:string[] = []
    fs.readdirSync(dir).forEach((path:string) => {
        paths.push(path)
    }); 
    let objs = []
    for(let i=0;i<paths.length;i++) {
        const { file, frontmatter } = await parse(dir+paths[i])
        objs.push({
            path: 'projects/'+paths[i].replace('.md', ''),
            content: file.value,
            frontmatter: frontmatter,
            completed: false
        })
    }
    // console.log(objs)

    return json(objs)
}