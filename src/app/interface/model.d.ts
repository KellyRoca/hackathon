interface DailyHabits {
  userId: string;  // Identificador del usuario
  days: Array<{
    date: string;  // Fecha en formato 'YYYY-MM-DD'
    meatConsumption: boolean;  // Si el usuario consumió carne
    transportUsage: { [key: string]: number };  // Objeto que contiene los medios de transporte y los minutos de uso
    deviceUsage: { [key: string]: number };  // Objeto que contiene los dispositivos y los minutos de uso
    timestamp: Date;  // Fecha y hora en que se registró la información
  }>;
}
