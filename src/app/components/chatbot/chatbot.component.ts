import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';  // Importación corregida
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  userName: string | null = null;
  habits: any = {
    diet: '',
    transport: [],
    devices: []
  };

  meatConsumption: boolean = false;
  transportUsage: any = {};
  deviceUsage: any = {};

  answeredMeatConsumption = false;
  answeredTransport = false;
  answeredDevices = false;

  showMeatConsumptionTyping = true;
  showTransportTyping = false;
  showDeviceTyping = false;
  showFinalMessageTyping = false;
  showActionButtons = false;
  co2Total: number = 0;  // Almacenar el total de CO2 calculado

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    if (userId) {
      // Obtener los hábitos del usuario desde Firestore
      const habitsDoc = await firstValueFrom(this.firestore.collection('habits').doc(userId).get());
      if (habitsDoc?.exists) {
        this.habits = habitsDoc.data();
        this.habits.transport.forEach((transport: string) => {
          this.transportUsage[transport] = 0;
        });
        this.habits.devices.forEach((device: string) => {
          this.deviceUsage[device] = 0;
        });
      }
    }

    // Mostrar "typing..." y luego el mensaje de "COMIDA"
    setTimeout(() => {
      this.showMeatConsumptionTyping = false;
    }, 500);  // Simula el tiempo de "escritura" del chatbot (2 segundos)
  }

  // Responder si el usuario comió carne o no
  answerMeatConsumption(answer: boolean) {
    this.meatConsumption = answer;
    this.answeredMeatConsumption = true;

    // Mostrar "typing..." y luego el siguiente mensaje (MOVILIDAD)
    this.showTransportTyping = true;
    setTimeout(() => {
      this.showTransportTyping = false;
    }, 500);
  }

  // Enviar la respuesta de la movilidad
  submitTransport() {
    this.answeredTransport = true;

    // Mostrar "typing..." y luego el siguiente mensaje (TECNOLOGÍA)
    this.showDeviceTyping = true;
    setTimeout(() => {
      this.showDeviceTyping = false;
    }, 500);
  }

  // Enviar la respuesta de la tecnología
  submitDevices() {
    this.answeredDevices = true;
    this.saveDailyHabits();  // Guardar los hábitos diarios con el cálculo de CO2

    // Mostrar "typing..." y luego el mensaje final
    this.showFinalMessageTyping = true;
    setTimeout(() => {
      this.showFinalMessageTyping = false;
      this.showActionButtons = true;  // Mostrar los botones de acción
    }, 500);
  }

  // Guardar los hábitos diarios en Firestore
  async saveDailyHabits() {
    try {
      const userId = await this.authService.getUserId();
      const today = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD

      if (userId) {
        const dailyHabitsDocRef = this.firestore.collection('daily_habits').doc(userId);

        // Obtener el documento de daily_habits para este usuario
        const dailyHabitsDoc = await firstValueFrom(dailyHabitsDocRef.get());

        let daysArray = [];

        if (dailyHabitsDoc.exists) {
          // Obtener el array de días si ya existe
          const dailyHabitsData = dailyHabitsDoc.data() as any;
          daysArray = dailyHabitsData.days || [];
        }

        // Calcular el total de CO2 para el día
        this.co2Total = this.calculateCO2();  // Guardar el valor en la propiedad co2Total

        // Agregar los nuevos datos del día actual al array de días
        daysArray.push({
          date: today,
          meatConsumption: this.meatConsumption,
          transportUsage: this.transportUsage,
          deviceUsage: this.deviceUsage,
          totalCO2: this.co2Total  // Agregar el total de CO2 calculado
        });

        // Guardar (actualizar) el documento en Firestore
        await dailyHabitsDocRef.set({
          userId,
          days: daysArray
        }, { merge: true });

        console.log('Hábitos diarios y CO2 guardados');
      }
    } catch (error) {
      console.error('Error al guardar hábitos diarios:', error);
    }
  }

  // Calcular las emisiones de CO2
  calculateCO2() {
    let totalCO2 = 0;

    // Calcular CO2 del consumo de carne
    totalCO2 += this.meatConsumption ? 11500 : 3000;

    // Calcular CO2 de los transportes
    Object.keys(this.transportUsage).forEach((transport: string) => {
      const minutes = this.transportUsage[transport] || 0;
      totalCO2 += minutes * (transport === 'Bus' ? 80 : 180);  // Ejemplo de cálculo
    });

    // Calcular CO2 de los dispositivos
    Object.keys(this.deviceUsage).forEach((device: string) => {
      const minutes = this.deviceUsage[device] || 0;
      totalCO2 += minutes * (device === 'Celular' ? 60 : device === 'Laptop' ? 90 : 80);
    });

    return totalCO2;
  }

  // Método para manejar la acción del usuario en los botones
  handleAction(action: string) {
    switch (action) {
      case 'metrics':
        console.log('Ver mis métricas');
        // Navegar a la página de métricas o ejecutar alguna lógica
        break;
      case 'recommend':
        console.log('¡Recomiéndame algo!');
        // Ejecutar lógica para recomendaciones
        break;
      case 'end':
        console.log('Terminar conversación');
        // Cerrar o finalizar el chat
        break;
    }
  }
}
