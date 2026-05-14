import axios from 'axios';
import { Injectable } from '@nestjs/common';

interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
}

@Injectable()
export class ViaCepService {
  async search(cep: string): Promise<Address> {
    const response = await axios.get<Address>(
      `https://viacep.com.br/ws/${cep}/json/`,
    );
    return response.data;
  }
}
