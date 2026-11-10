"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Music2, ChevronLeft, Sparkles } from "lucide-react";
import InteractiveHeart from "@/components/InteractiveHeart";
import DateCalendar from "@/components/DateCalendar";
import { activities, categoryLabels, moodOptions } from "@/lib/activities";
import { formatDateES, cn } from "@/lib/utils";

type Screen =
  | "welcome"
  | "heart"
  | "invitation"
  | "calendar"
  | "activities"
  | "mood"
  | "summary"
  | "confirm"
  | "success";

interface FormData {
  selectedDate: Date | null;
  selectedActivities: string[];
  mood: string | null;
  extraActivity: string;
  specialNote: string;
  preferQuiet: boolean;
}

const STORAGE_KEY = "una-cita-contigo-data";

const screenOrder: Screen[] = [
  "welcome",
  "heart",
  "invitation",
  "calendar",
  "activities",
  "mood",
  "summary",
  "confirm",
  "success",
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [formData, setFormData] = useState<FormData>({
    selectedDate: null,
    selectedActivities: [],
    mood: null,
    extraActivity: "",
    specialNote: "",
    preferQuiet: false,
  });
  const [heartDone, setHeartDone] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({
          ...parsed,
          selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : null,
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...formData,
          selectedDate: formData.selectedDate?.toISOString() ?? null,
        })
      );
    } catch {
      /* ignore */
    }
  }, [formData]);

  const goTo = useCallback(
    (next: Screen) => {
      const currentIdx = screenOrder.indexOf(screen);
      const nextIdx = screenOrder.indexOf(next);
      setDirection(nextIdx > currentIdx ? 1 : -1);
      setScreen(next);
    },
    [screen]
  );

  const goBack = () => {
    const idx = screenOrder.indexOf(screen);
    if (idx > 0) goTo(screenOrder[idx - 1]);
  };

  const toggleActivity = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedActivities.includes(id);
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter((a) => a !== id)
          : [...prev.selectedActivities, id],
        preferQuiet: false,
      };
    });
  };

  const toggleQuiet = () => {
    setFormData((prev) => ({
      ...prev,
      preferQuiet: !prev.preferQuiet,
      selectedActivities: !prev.preferQuiet ? [] : prev.selectedActivities,
    }));
  };

  const handleConfirm = async () => {
    setIsSending(true);
    setSendError(null);

    try {
      const selectedActs = activities.filter((a) =>
        formData.selectedActivities.includes(a.id)
      );
      const moodLabel =
        moodOptions.find((m) => m.id === formData.mood)?.label ?? "No especificado";

      const res = await fetch("/api/send-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.selectedDate?.toISOString(),
          dateFormatted: formData.selectedDate
            ? formatDateES(formData.selectedDate)
            : "Sin fecha",
          activities: selectedActs.map((a) => `${a.emoji} ${a.title}`),
          mood: moodLabel,
          extraActivity: formData.extraActivity,
          specialNote: formData.specialNote,
          preferQuiet: formData.preferQuiet,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar");
      }

      goTo("success");
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo."
      );
    } finally {
      setIsSending(false);
    }
  };

  const progress = Math.max(0, screenOrder.indexOf(screen));
  const totalSteps = 7;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-pastel/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-beige-soft/30 blur-3xl" />
        <div className="absolute top-[40%] right-[-5%] w-[30%] h-[30%] rounded-full bg-rose-powder/15 blur-3xl" />
      </div>

      {screen !== "welcome" && screen !== "success" && (
        <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
          <div className="max-w-md mx-auto flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-500",
                  i < progress
                    ? "bg-rose-deep"
                    : i === progress
                    ? "bg-rose-powder"
                    : "bg-rose-soft/40"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {screen !== "welcome" && screen !== "success" && screen !== "heart" && (
        <button
          onClick={goBack}
          className="fixed top-8 left-4 z-40 p-2 rounded-full bg-cream/80 backdrop-blur border border-rose-powder/40 text-rose-deep hover:bg-rose-soft/50 transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={() => setMusicOn(!musicOn)}
        className="music-btn"
        aria-label={musicOn ? "Desactivar música" : "Activar música"}
      >
        {musicOn ? (
          <Music2 className="w-5 h-5 text-rose-deep" />
        ) : (
          <Music className="w-5 h-5 text-rose-wine/60" />
        )}
      </button>

      {musicOn && (
        <audio autoPlay loop src="/romantic-ambient.mp3" className="hidden" />
      )}

      <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {screen === "welcome" && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <span className="text-5xl">💕</span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl sm:text-4xl text-rose-wine leading-tight mb-6"
              >
                Hola, tú. <span className="text-rose-deep">❤️</span>
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="space-y-4 text-rose-wine/80 font-light leading-relaxed text-[15px] sm:text-base"
              >
                <p>Preparé algo pequeño para ti.</p>
                <p>
                  No es una tarea, no es un compromiso y tampoco tienes que
                  hacerlo ahora.
                </p>
                <p>
                  Solo quería regalarte un espacio para que, cuando tengas
                  ganas, podamos crear momentos bonitos juntos.
                </p>
                <p className="font-medium text-rose-deep pt-2">
                  ¿Me regalas unos segundos?
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={() => goTo("heart")}
                className="btn-primary mt-10 text-base"
              >
                Tengo curiosidad ✨
              </motion.button>
            </motion.div>
          )}

          {screen === "heart" && (
            <motion.div
              key="heart"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-md text-center"
            >
              <p className="font-serif text-lg text-rose-wine/80 italic mb-2">
                Dicen que los pequeños detalles hacen grandes momentos...
              </p>

              <div className="my-8">
                <InteractiveHeart
                  onComplete={() => setHeartDone(true)}
                />
              </div>

              <p className="text-rose-wine/70 text-sm mb-6 max-w-xs mx-auto">
                Tengo algo para ti. Pero primero, tendrás que darle un poquito
                de amor a este corazón.
              </p>

              {heartDone && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-rose-deep font-medium mb-5">
                    ¡Listo! Ahora sí, tengo una pequeña propuesta para ti. ❤️
                  </p>
                  <button
                    onClick={() => goTo("invitation")}
                    className="btn-primary"
                  >
                    Descubrir mi sorpresa
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {screen === "invitation" && (
            <motion.div
              key="invitation"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-md text-center"
            >
              <h2 className="font-serif text-2xl sm:text-3xl text-rose-wine mb-6">
                Tengo una propuesta para ti...
              </h2>

              <div className="space-y-4 text-rose-wine/80 font-light leading-relaxed text-[15px] text-left">
                <p>
                  Sé que tus días pueden estar llenos de responsabilidades,
                  trabajo, universidad, pendientes y muchas otras cosas.
                </p>
                <p>
                  Sé que a veces necesitas descansar, desconectarte y
                  simplemente tener un momento para ti.
                </p>
                <p>
                  Por eso no quiero que esto sea una obligación ni algo que
                  tengas que acomodar entre mil pendientes.
                </p>
                <p>
                  Simplemente quiero que, cuando tengas un espacio, cuando te
                  sientas con ganas y cuando quieras salir un poquito de la
                  rutina, podamos regalarnos un momento bonito.
                </p>
                <p className="font-medium text-rose-deep text-center pt-2">
                  Así que preparé algo para nosotros...
                </p>
              </div>

              <div className="my-8 flex justify-center gap-4 text-3xl opacity-80">
                <span>☕</span>
                <span>🌸</span>
                <span>🤝</span>
              </div>

              <button onClick={() => goTo("calendar")} className="btn-primary">
                Vamos a planear algo bonito
              </button>
            </motion.div>
          )}

          {screen === "calendar" && (
            <motion.div
              key="calendar"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl text-rose-wine mb-1">
                  Agenda una cita con tu hombre ❤️
                </h2>
                <p className="text-sm text-rose-wine/70">
                  Tú eliges el momento. Yo me encargo de hacer que valga la
                  pena.
                </p>
              </div>

              <div className="bg-cream/80 backdrop-blur rounded-3xl p-5 shadow-soft border border-rose-powder/30">
                <DateCalendar
                  selectedDate={formData.selectedDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, selectedDate: date }))
                  }
                />
              </div>

              <p className="text-center text-xs text-rose-wine/60 mt-5 px-4 leading-relaxed">
                No importa si es mañana, en unos días o cuando tengas un
                espacio. Lo importante es que los dos tengamos ganas.
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => goTo("activities")}
                  disabled={!formData.selectedDate}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {screen === "activities" && (
            <motion.div
              key="activities"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl text-rose-wine mb-1">
                  Ahora viene la parte interesante...
                </h2>
                <p className="text-sm text-rose-wine/70">
                  ¿Qué se te antoja hacer conmigo?
                </p>
                <p className="text-xs text-rose-wine/50 mt-2">
                  Puedes elegir una o varias opciones
                </p>
              </div>

              <button
                onClick={toggleQuiet}
                className={cn(
                  "w-full mb-5 p-4 rounded-2xl border-2 text-left transition-all card-select",
                  formData.preferQuiet
                    ? "selected border-rose-deep"
                    : "border-rose-powder/40 bg-cream/60"
                )}
              >
                <span className="text-lg">🌿</span>
                <span className="ml-2 font-medium text-rose-wine">
                  Hoy prefiero algo tranquilo
                </span>
                <p className="text-xs text-rose-wine/60 mt-1 ml-7">
                  Estoy cansada o simplemente quiero un plan relajado
                </p>
              </button>

              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1 pb-4">
                {(
                  Object.keys(categoryLabels) as Array<
                    keyof typeof categoryLabels
                  >
                ).map((cat) => (
                  <div key={cat}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-wine/50 mb-2 px-1">
                      {categoryLabels[cat]}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {activities
                        .filter((a) => a.category === cat)
                        .map((act) => {
                          const selected = formData.selectedActivities.includes(
                            act.id
                          );
                          return (
                            <button
                              key={act.id}
                              onClick={() => toggleActivity(act.id)}
                              className={cn(
                                "p-3.5 rounded-2xl border-2 text-left transition-all card-select",
                                selected
                                  ? "selected border-rose-deep"
                                  : "border-rose-powder/30 bg-cream/50 hover:border-rose-powder"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-xl flex-shrink-0">
                                  {act.emoji}
                                </span>
                                <div>
                                  <p className="font-medium text-rose-wine text-sm">
                                    {act.title}
                                  </p>
                                  <p className="text-xs text-rose-wine/55 mt-0.5">
                                    {act.description}
                                  </p>
                                </div>
                                {selected && (
                                  <span className="ml-auto text-rose-deep">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => goTo("mood")}
                  disabled={
                    formData.selectedActivities.length === 0 &&
                    !formData.preferQuiet
                  }
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {screen === "mood" && (
            <motion.div
              key="mood"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl text-rose-wine mb-1">
                  Una última cosita...
                </h2>
                <p className="text-sm text-rose-wine/70">
                  ¿Qué tipo de cita te provoca en este momento?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, mood: opt.id }))
                    }
                    className={cn(
                      "p-3.5 rounded-2xl border-2 text-center transition-all card-select",
                      formData.mood === opt.id
                        ? "selected border-rose-deep"
                        : "border-rose-powder/30 bg-cream/50"
                    )}
                  >
                    <span className="text-xl block mb-1">{opt.emoji}</span>
                    <span className="text-xs font-medium text-rose-wine">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-rose-wine/70 mb-1.5">
                    ¿Hay algo que te gustaría hacer y que todavía no hayamos
                    mencionado?
                  </label>
                  <textarea
                    value={formData.extraActivity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        extraActivity: e.target.value,
                      }))
                    }
                    placeholder="Opcional..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl border border-rose-powder/40 bg-cream/70 text-sm text-rose-wine placeholder:text-rose-wine/40 focus:outline-none focus:border-rose-deep/50 focus:ring-2 focus:ring-rose-powder/30 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-rose-wine/70 mb-1.5">
                    ¿Alguna cosita que deba saber para hacer de este momento
                    algo especial?
                  </label>
                  <textarea
                    value={formData.specialNote}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialNote: e.target.value,
                      }))
                    }
                    placeholder="Opcional... preferencias, alergias, sueños..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl border border-rose-powder/40 bg-cream/70 text-sm text-rose-wine placeholder:text-rose-wine/40 focus:outline-none focus:border-rose-deep/50 focus:ring-2 focus:ring-rose-powder/30 resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => goTo("summary")}
                  disabled={!formData.mood}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Ver resumen
                </button>
              </div>
            </motion.div>
          )}

          {screen === "summary" && (
            <motion.div
              key="summary"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl text-rose-wine mb-1">
                  Creo que tenemos un plan... ❤️
                </h2>
              </div>

              <div className="bg-cream/90 backdrop-blur rounded-3xl p-6 shadow-card border border-rose-powder/30 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-rose-wine/50 mb-1">
                    Fecha
                  </p>
                  <p className="font-serif text-rose-deep capitalize">
                    {formData.selectedDate
                      ? formatDateES(formData.selectedDate)
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-rose-wine/50 mb-2">
                    Actividades
                  </p>
                  {formData.preferQuiet ? (
                    <p className="text-sm text-rose-wine">🌿 Algo tranquilo</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {activities
                        .filter((a) =>
                          formData.selectedActivities.includes(a.id)
                        )
                        .map((a) => (
                          <li
                            key={a.id}
                            className="text-sm text-rose-wine flex gap-2"
                          >
                            <span>{a.emoji}</span>
                            <span>{a.title}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-rose-wine/50 mb-1">
                    Tipo de cita
                  </p>
                  <p className="text-sm text-rose-wine">
                    {moodOptions.find((m) => m.id === formData.mood)?.emoji}{" "}
                    {moodOptions.find((m) => m.id === formData.mood)?.label}
                  </p>
                </div>

                {formData.extraActivity && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-rose-wine/50 mb-1">
                      Algo más
                    </p>
                    <p className="text-sm text-rose-wine italic">
                      &ldquo;{formData.extraActivity}&rdquo;
                    </p>
                  </div>
                )}

                {formData.specialNote && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-rose-wine/50 mb-1">
                      Nota especial
                    </p>
                    <p className="text-sm text-rose-wine italic">
                      &ldquo;{formData.specialNote}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              <p className="text-center text-sm text-rose-wine/70 mt-6 leading-relaxed">
                Ahora solo falta una cosita: hacer que este pequeño plan se
                convierta en un bonito recuerdo.
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => goTo("confirm")}
                  className="btn-primary"
                >
                  Confirmar nuestra cita ❤️
                </button>
              </div>
            </motion.div>
          )}

          {screen === "confirm" && (
            <motion.div
              key="confirm"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="w-full max-w-sm text-center"
            >
              <div className="mb-6">
                <Sparkles className="w-10 h-10 text-gold-soft mx-auto mb-3" />
                <h2 className="font-serif text-xl text-rose-wine">
                  ¿Estás segura de que quieres proponer este plan?
                </h2>
              </div>

              {sendError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                  {sendError}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={isSending}
                  className="btn-primary disabled:opacity-60"
                >
                  {isSending ? "Enviando..." : "¡Sí, vamos a hacerlo!"}
                </button>
                <button
                  onClick={() => goTo("summary")}
                  disabled={isSending}
                  className="btn-secondary"
                >
                  Quiero cambiar algo
                </button>
              </div>
            </motion.div>
          )}

          {screen === "success" && (
            <motion.div
              key="success"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full max-w-md text-center"
            >
              <div className="relative h-16 mb-4">
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: -30 - Math.random() * 50,
                      x: (Math.random() - 0.5) * 120,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.15,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                    className="absolute left-1/2 text-xl"
                  >
                    {["❤️", "💕", "🌸", "✨"][i % 4]}
                  </motion.span>
                ))}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-rose-wine mb-6">
                ¡Tenemos una cita pendiente! ❤️
              </h2>

              <div className="space-y-4 text-rose-wine/80 font-light leading-relaxed text-[15px] text-left">
                <p>
                  Gracias por regalarme un espacio entre tantas cosas que hacen
                  parte de tus días.
                </p>
                <p>
                  No sé qué plan terminaremos haciendo, dónde iremos o qué
                  terminaremos descubriendo.
                </p>
                <p>
                  Pero sí sé que me gusta compartir tiempo contigo y que quiero
                  seguir creando momentos bonitos a tu lado.
                </p>
                <p>
                  Recuerda que no tienes que tener todo el tiempo del mundo
                  para compartir conmigo. Me basta con que sea un momento en el
                  que los dos queramos estar ahí.
                </p>
                <p className="font-medium text-rose-deep text-center pt-2">
                  Ahora déjame encargarme de algo...
                  <br />
                  ¡Preparar una cita que te saque una sonrisa!
                </p>
              </div>

              <p className="font-script text-2xl text-rose-deep mt-8">
                Con cariño, Tu hombre. ❤️
              </p>

              <button
                onClick={() => {
                  setScreen("welcome");
                  setHeartDone(false);
                  setFormData({
                    selectedDate: null,
                    selectedActivities: [],
                    mood: null,
                    extraActivity: "",
                    specialNote: "",
                    preferQuiet: false,
                  });
                }}
                className="btn-secondary mt-10"
              >
                Volver a sonreír
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
