import { NextRequest, NextResponse } from "next/server"

export default function handler(req: any, res: any) {
    // Get data submitted in request's body.
    const body = req.body

    console.log(req, res)
  
    if (!body) return res.send(400).json({data:"REEEEE"})

    var tz = body.tz === undefined ? false : true
    var order = body.order === undefined ? false : true
    var guild = body.guild

    console.log(req.headers)
  
    // Found the name.
    // Sends a HTTP success code
    res.status(200).json({ data: `${body.tz} ${body.order}` })
  }