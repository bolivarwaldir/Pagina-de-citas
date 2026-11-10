import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "El servicio de correo no está configurado todavía." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      dateFormatted,
      activities,
      mood,
      extraActivity,
      specialNote,
      preferQuiet,
    } = body;

    if (!dateFormatted) {
      return NextResponse.json(
        { error: "Falta la fecha seleccionada." },
        { status: 400 }
      );
    }

    const activitiesList =
      preferQuiet
        ? "🌿 Algo tranquilo"
        : Array.isArray(activities) && activities.length > 0
        ? activities.join("<br/>")
        : "Ninguna seleccionada";

    const activitiesText =
      preferQuiet
        ? "🌿 Algo tranquilo"
        : Array.isArray(activities) && activities.length > 0
        ? activities.join("\n")
        : "Ninguna seleccionada";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FDF8F5;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(196,92,92,0.12);">
    <div style="background:linear-gradient(135deg,#C45C5C,#8B3A3A);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:400;">¡Tenemos una cita pendiente! ❤️</h1>
    </div>
    <div style="padding:32px 28px;color:#5C3A3A;line-height:1.7;">
      <p style="margin:0 0 20px;font-size:16px;">Alguien acaba de elegir compartir un momento contigo.</p>
      
      <div style="background:#FDF8F5;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #E8C4C4;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C45C5C;">Fecha propuesta</p>
        <p style="margin:0;font-size:18px;font-weight:500;">${dateFormatted}</p>
      </div>

      <div style="background:#FDF8F5;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #E8C4C4;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C45C5C;">Planes seleccionados</p>
        <p style="margin:0;font-size:15px;">${activitiesList}</p>
      </div>

      <div style="background:#FDF8F5;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #E8C4C4;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C45C5C;">Tipo de cita</p>
        <p style="margin:0;font-size:15px;">${mood || "No especificado"}</p>
      </div>

      ${
        extraActivity
          ? `<div style="background:#FDF8F5;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #E8C4C4;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C45C5C;">Algo más que le gustaría</p>
        <p style="margin:0;font-size:15px;font-style:italic;">"${extraActivity}"</p>
      </div>`
          : ""
      }

      ${
        specialNote
          ? `<div style="background:#FDF8F5;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #E8C4C4;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C45C5C;">Nota especial</p>
        <p style="margin:0;font-size:15px;font-style:italic;">"${specialNote}"</p>
      </div>`
          : ""
      }

      <p style="margin:28px 0 0;font-size:15px;text-align:center;color:#8B3A3A;">
        Ahora tienes una pequeña misión:<br/>
        <strong>hacer que ese momento sea inolvidable</strong>.
      </p>
    </div>
    <div style="padding:16px;text-align:center;background:#FAF3EE;font-size:12px;color:#C45C5C;">
      Una cita contigo ❤️
    </div>
  </div>
</body>
</html>
`;

    const text = `
¡Tenemos una cita pendiente!

Alguien acaba de elegir compartir un momento contigo.

Fecha propuesta: ${dateFormatted}

Planes seleccionados:
${activitiesText}

Tipo de cita: ${mood || "No especificado"}

${extraActivity ? `Algo más: ${extraActivity}` : ""}
${specialNote ? `Nota especial: ${specialNote}` : ""}

Ahora tienes una pequeña misión: hacer que ese momento sea inolvidable.
`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Una cita contigo <onboarding@resend.dev>",
      to: ["bolivarwaldir@gmail.com"],
      subject: "Tenemos una cita pendiente ❤️",
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "No se pudo enviar el correo. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
