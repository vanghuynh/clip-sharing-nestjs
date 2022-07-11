import { Injectable, PipeTransform, ArgumentMetadata, HttpException, HttpStatus } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class Validation implements PipeTransform<any> {

    async transform(value: any, metadata: ArgumentMetadata) {
        //for file submitted
        if (value instanceof Object && this.isEmpty(value)) {
            throw new HttpException('Validation failed: No body submitted', HttpStatus.BAD_REQUEST);
        }
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        try {
            const errors = await validate(object);
            if (errors.length > 0) {
                throw new HttpException(`Validation failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw new HttpException('Issue validate object' + err, HttpStatus.BAD_REQUEST);;
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private formatErrors(errors: any[]) {
        return errors.map(err => {
            for (let property in err.constraints) {
                return err.constraints[property];
            }
        }).join(', ');
    }

    private isEmpty(value: any) {
        if (Object.keys(value).length > 0) {
            return false;
        }
        return true;
    }
}