
export default async function GET(url){
    try {
        const res = await fetch(`${url}/`)
        const data = await res.json()
        return data
    }catch(err){
        console.error(err)
        return null
    }
}