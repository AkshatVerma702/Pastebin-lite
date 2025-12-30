import { getPaste } from "@/app/lib/store";

export async function GET(_req: Request, 
    {params} : {params: Promise<{
        id: string
    }>}
){
    const {id} = await params
    const content = getPaste(id)

    if(!content) {
        return new Response(
            JSON.stringify({
                error: "Paste not found"
            }),
            {
                status: 404
            }
        )
    }

    return new Response(
        JSON.stringify({
            content
        }),
        {status: 200}
    )
}