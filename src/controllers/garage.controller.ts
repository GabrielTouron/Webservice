import { Request, Response } from 'express';
import garageService from '../services/garage.service';
import { Garage, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { errorHandler } from '../utils/error_handler';

export default class GarageController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).send({
        message: 'Content can not be empty!',
      });
    }

    try {
      const garage: Garage = req.body;
      garage.userId = (req as AuthenticatedRequest).token.id;
      const savedGarage = await garageService.save(garage);

      res.status(201).send(savedGarage);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const garages = await garageService.retrieveAll(req.query as Pagination);
      res.status(200).send(garages);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const garage = await garageService.retrieveById(id);
      if (garage) {
        res.status(200).send(garage);
      } else {
        res.status(404).send(`Garage with id=${id} not found`);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async update(req: Request, res: Response) {
    const garageToUpdate: Garage = req.body;
    garageToUpdate.id = parseInt(req.params.id);

    try {
      const garage = await garageService.update(garageToUpdate);
      res.status(200).send(garage);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Garage with id=${garageToUpdate.id} not found`,
        });
      } else {
        errorHandler(res, error);
      }
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      await garageService.delete(id);
      res.status(200).send({
        message: `Garage with id=${id} deleted`,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Garage with id=${id} not found`,
        });
      } else {
        errorHandler(res, error);
      }
    }
  }
}
