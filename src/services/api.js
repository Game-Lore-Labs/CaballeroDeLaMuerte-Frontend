// ============================================================================
// src/services/api.js
// ============================================================================

const API_BASE_URL = 'http://localhost:3000/api';

class RPGApiService {
  async createCharacter(name, charClass) {
    try {
      const response = await fetch(`${API_BASE_URL}/character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reqName: name,
          reqClass: charClass,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear personaje');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createCharacter:', error);
      throw error;
    }
  }

  async makeChoice(choiceIndex, gameState) {
    try {
      const response = await fetch(`${API_BASE_URL}/choice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          choiceIndex,
          state: gameState,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Error al procesar elección');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en makeChoice:', error);
      throw error;
    }
  }

  async rollDice(diceCount, diceSides) {
    try {
      const response = await fetch(`${API_BASE_URL}/dice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diceCount,
          diceSides,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al tirar dados');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en rollDice:', error);
      throw error;
    }
  }

  async getAvailableClasses() {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`);
      
      if (!response.ok) {
        throw new Error('Error al obtener clases');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAvailableClasses:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error en healthCheck:', error);
      throw error;
    }
  }
}

export default new RPGApiService();