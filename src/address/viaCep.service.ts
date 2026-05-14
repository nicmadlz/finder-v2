import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';

interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  erro?: boolean;
}

@Injectable()
export class ViaCepService {
  async search(cep: string): Promise<Address> {
    const response = await axios.get<Address>(
      `https://viacep.com.br/ws/${cep}/json/`,
    );

    if (response.data.erro) {
      throw new NotFoundException("This CEP doesn't exists");
    }

    return response.data;
  }
}
