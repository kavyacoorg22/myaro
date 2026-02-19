
export interface Calculator
{
  calculate(employeeType:string,salary:number):number
}


class SalaryCalculator implements Calculator{
  calculate(employeeType: string, salary: number): number {
    if (employeeType === "PERMANENT") {
      return salary + salary * 0.2;
    }
    if (employeeType === "CONTRACT") {
      return salary + salary * 0.1;
    }
    return salary;
  }
}

class TeacherSalaryCalculator implements Calculator{
  calculate(employeeType: string, salary: number): number {
      if (employeeType === "PERMANENT") {
      return salary + salary * 0.2;
    }
    if (employeeType === "CONTRACT") {
      return salary + salary * 0.1;
    }
    return salary;
  }
}
