import { savePaste } from "@/app/lib/store";
import { nanoid } from "nanoid";

export async function POST(req: Request){
    try{
        const body = await req.json()

        if(!body.content || typeof body.content !== "string"){
            return new Response(
                    JSON.stringify({
                        error: "Content is required"
                    }),
                    {status: 400}
            );
        }

        const id = nanoid(8)
        savePaste(id, body.content)

        return new Response(
            JSON.stringify({
                id, 
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/paste/${id}`,
            }),
            {status: 201}
        )
    }
    catch{
        return new Response(
            JSON.stringify({
                error: "Invalid JSON"
            }),
            {
                status: 400
            }
        )
    }
}