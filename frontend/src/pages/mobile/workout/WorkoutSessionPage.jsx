import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconBackArrow, IconLoader, IconCheck, IconX } from "../../../components/icons/Icons";
import { Button } from "@/components/ui/button";
import ExerciseUnitView from "./components/ExerciseUnitView";
import RestTimerOverlay from "./components/RestTimerOverlay";
import { API_URL } from '../../../config/api';

export default function WorkoutSessionPage() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [routineMeta, setRoutineMeta] = useState(null);
  const [workoutData, setWorkoutData] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(new Date());

  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/api/users/routine/${routineId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setRoutineMeta({ id: data.idRutina, nombre: data.nombre });
          
          // --- INICIALIZACIÓN INTELIGENTE ---
          const initialWorkoutState = data.ejercicios.map(ej => {
            // Opción 1: Hay datos previos (Memoria Muscular)
            if (ej.last_session_data && ej.last_session_data.length > 0) {
                return {
                    ...ej,
                    performedSets: ej.last_session_data.map(s => ({
                        weight: s.weight,
                        reps: s.reps,
                        completed: false // Siempre desmarcadas al empezar
                    })),
                    currentRestTimerSetting: ej.descanso_segundos || 90
                };
            }
            // Opción 2: Nueva rutina -> 2 Series por defecto (vacías)
            return {
                ...ej,
                performedSets: Array.from({ length: ej.series_objetivo || 2 }).map(() => ({
                    weight: '',
                    reps: '',
                    completed: false
                })),
                currentRestTimerSetting: ej.descanso_segundos || 90
            };
          });

          setWorkoutData(initialWorkoutState);
        }
      } catch (error) {
        console.error("Error fetching routine:", error);
        alert("Error al cargar la rutina");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutineData();
  }, [routineId, navigate]);

  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (restTimeLeft <= 0 && isResting) {
      setIsResting(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isResting, restTimeLeft]);

  const triggerRestTimer = (duration) => {
    setRestDuration(duration);
    setRestTimeLeft(duration);
    setIsResting(true);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutData.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleFinishWorkout = async () => {
    if (!window.confirm("¿Finalizar entrenamiento y guardar?")) return;
    setLoading(true);

    const endTime = new Date();
    const durationSeconds = Math.round((endTime - startTimeRef.current) / 1000);

    const payload = {
        rutinaId: routineMeta.id,
        nombreRutina: routineMeta.nombre,
        durationSeconds: durationSeconds,
        exercises: workoutData
    };

    try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/api/users/workout/save`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            navigate('/');
        } else {
            alert("Error al guardar el entrenamiento.");
        }
    } catch (error) {
        console.error("Error saving workout:", error);
        alert("Error de conexión al guardar.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background"><IconLoader className="animate-spin w-8 h-8 text-primary"/></div>;

  const currentExercise = workoutData[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workoutData.length - 1;

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/95 backdrop-blur-sm z-10">
        <button onClick={() => window.confirm("¿Salir sin guardar?") && navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <IconX className="w-6 h-6" />
        </button>
        <div className="text-center">
             <h2 className="text-sm font-bold text-foreground w-48 truncate">{currentExercise.nombre}</h2>
             <p className="text-xs text-muted-foreground">
                Ejercicio {currentExerciseIndex + 1} de {workoutData.length}
             </p>
        </div>
        <Button size="sm" variant="ghost" className="text-primary font-bold" onClick={handleFinishWorkout}>
            Finalizar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <ExerciseUnitView 
            exerciseData={currentExercise}
            exerciseIndex={currentExerciseIndex}
            setWorkoutData={setWorkoutData}
            onSetComplete={triggerRestTimer}
        />
      </div>

       <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur-sm z-10 flex gap-3">
            <Button
                variant="outline"
                className="flex-1 rounded-full border-border/50 text-muted-foreground disabled:opacity-30"
                onClick={handlePrevExercise}
                disabled={currentExerciseIndex === 0}
            >
                Anterior
            </Button>

            {isLastExercise ? (
                 <Button 
                    className="flex-[2] rounded-full font-bold bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleFinishWorkout}
                >
                    Terminar Rutina <IconCheck className="w-5 h-5 ml-2"/>
                </Button>
            ) : (
                <Button 
                    className="flex-[2] rounded-full font-bold"
                    onClick={handleNextExercise}
                >
                    Siguiente Ejercicio
                </Button>
            )}
       </div>

       <RestTimerOverlay 
          isResting={isResting}
          timeLeft={restTimeLeft}
          totalTime={restDuration}
          onCancel={() => setIsResting(false)}
          onAddSeconds={(secs) => setRestTimeLeft(prev => prev + secs)}
       />
    </div>
  );
}