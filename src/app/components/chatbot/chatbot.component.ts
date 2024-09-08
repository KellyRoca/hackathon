import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';  // Importación corregida
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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
  recommendationMessage: string[] = [];
  showRecommendationMessage = false;

  constructor(private firestore: AngularFirestore, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    if (userId) {
      // Obtener los hábitos del usuario desde Firestore
      const habitsDoc = await firstValueFrom(this.firestore.collection('habits').doc(userId).get());
      if (habitsDoc?.exists) {
        this.habits = habitsDoc.data();
        console.log(this.habits)
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
      totalCO2 += minutes * (transport === '🚌 Bus' ? 80 : transport === '🚗 Carro o Taxi' ? 180 : 0);  // Ejemplo de cálculo
    });

    // Calcular CO2 de los dispositivos
    Object.keys(this.deviceUsage).forEach((device: string) => {
      const minutes = this.deviceUsage[device] || 0;
      totalCO2 += minutes * (device === '📱 Celular' ? 60 : device === '💻 Laptop' ? 90 : device === '📲 Tablet' ? 80 : 0);
    });

    return totalCO2;
  }

  handleAction(action: string) {
    switch (action) {
      case 'metrics':
        console.log('Ver mis métricas');
        // Lógica para ver métricas
        break;
      case 'recommend':
        this.showRecommendations();
        break;
      case 'end':
        this.router.navigate(['inicio'])
        // Lógica para finalizar el chat
        break;
    }
  }

  showRecommendations() {
    let recommendations: string[] = [];

    if (this.co2Total <= 5500) {
      recommendations = [
        'Instala paneles solares de Enel X Solar y comienza a generar tu propia energía limpia.',
        'Cambia a bombillas Philips LED y reduce tu consumo eléctrico de inmediato.',
        'Elige una bicicleta Aro Bikes y recorre tu ciudad de manera ecológica.',
        'Utiliza la Compostera BioMate para convertir tus restos de comida en abono orgánico.',
        'Únete a los talleres de la SPDA y aprende cómo reducir tu impacto ambiental hoy mismo.'
      ];
    } else if (this.co2Total >= 5501 && this.co2Total <= 15000) {
      recommendations = [
        'Prueba los productos de QuinoaLife y comienza a reducir tu consumo de carne roja con opciones vegetales deliciosas.',
        'Únete a la comunidad de carpooling de EasyCarpool y disminuye tu huella de carbono en cada viaje.',
        'Recicla con EcoPuntos en Lima y dale una nueva vida a tus residuos reciclables.',
        'Reemplaza tus electrodomésticos por modelos A++ de Bosch y ahorra energía en casa.',
        'Mejora el aislamiento con productos Isover y reduce el uso de calefacción y refrigeración.',
        'Únete a las campañas de Greenpeace Perú y protege los ecosistemas locales.'
      ];
    } else if (this.co2Total >= 15001 && this.co2Total <= 27000) {
      recommendations = [
        'Viaja más en bus con Cruz del Sur y reduce tus vuelos aéreos.',
        'Instala paneles solares de Solem y comienza a usar energía renovable en casa.',
        'Cambia a un vehículo eléctrico de Nissan y reduce tu impacto ambiental.',
        'Recicla tus electrónicos en los puntos de Claro Recicla y gestiona tus residuos tecnológicos.',
        'Instala grifos de ahorro de agua Rotoplas y reduce el consumo en casa.',
        'Incorpora productos de Veggie Perú para disfrutar más días sin carne.'
      ];
    } else if (this.co2Total > 27000) {
      recommendations = [
        'Inicia una dieta con productos de Madre Natura y reduce drásticamente el consumo de carne.',
        'Cambia a un auto eléctrico Nissan o usa transporte público para eliminar los autos de combustión.',
        'Instala energía renovable con Auto Solar Perú y reduce tu dependencia de la red eléctrica.',
        'Compra a granel con BioMarket y deja atrás los plásticos no reciclables.',
        'Únete a la reforestación de Conservamos por Naturaleza y participa en la protección de áreas naturales.',
        'Transforma tu hogar con soluciones ecológicas de EcoCasa y hazlo más eficiente energéticamente.'
      ];
    }

    // Simular "escribiendo" antes de mostrar el mensaje
    this.showFinalMessageTyping = true;
    setTimeout(() => {
      this.showFinalMessageTyping = false;
      // Almacenar las recomendaciones en un array
      this.recommendationMessage = recommendations;
      this.showRecommendationMessage = true;
    }, 500);
  }

}
