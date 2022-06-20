import { BigInt } from "@graphprotocol/graph-ts"
import { Contract, EnrollmentIssued } from "../generated/Contract/Contract"
import { Student, Activity, StudentActivity } from "../generated/schema"

export function handleEnrollmentIssued(event: EnrollmentIssued): void {


  // ===================
  // Entidad - Student
  // ===================

  let idStudent = event.params.studentId
  let student = Student.load(idStudent)
  if(!student){
    student = new Student(idStudent)
  }
  student.name = event.params.studentId.toString()

  student.save()


  // ===================
  // Entidad - Activity
  // ===================
  let idActivity = event.params.activityId
  let activity = Activity.load(idActivity)
  if(!activity){
    activity = new Activity(idActivity)
  }

  let contract = Contract.bind(event.address)
  activity.count = contract.getActivityEnrollmentCount(idActivity)

  // TODO : Añadir categoria en el contrato?¿
  //activity.category = event.params.activityId.toString()

  activity.save()


  // ===========================
  // Entidad - StudentActivity
  // ===========================

  // Se genera un id para guardar la entidad que se genera cada vez que un estudiante 
  // se registra en una actividad
  let idStudentActivity = event.transaction.hash.toHex() + "-" + event.logIndex.toString()

  // Se trata de obtener la entidad 
  let studentactivity = StudentActivity.load(idStudentActivity)
  if(!studentactivity){
    studentactivity = new StudentActivity(idStudentActivity)
  }

  studentactivity.student = event.params.studentId
  studentactivity.activity = event.params.activityId

  studentactivity.save()

}

/*
// Esto se deberia hacer si el student_id fuera el de su cuenta de Metamask
//   let entity = Student.load(event.transaction.from.toHex())
//  
//    if (!entity) {
//      entity = new Student(event.transaction.from.toHex())
//



  // ===================
  // Entidad - Activity
  // ===================

  // Se intenta obtener de la blockchain
  let activity = Activity.load(event.params.activityId)

  // Si no existe, se crea
  if(!activity) {
      activity = new Activity(event.params.activityId)
      activity.count = BigInt.fromI32(0)
      activity.studentsId = [event.params.activityId]
  }
  
  // Se añade una persona más al conteo
  if (activity.count){
    //activity.count.plus(BigInt.fromI32(1))
  }

  // Se añade el identificador del estudiante
  activity.studentsId.push(event.params.studentId)


  // Se calcula el conteo que hace el Smart Contract para ver si hay diferencias
  let contract = Contract.bind(event.address)
  activity.count = contract.getActivityEnrollmentCount(event.params.activityId)
  activity.address = event.address.toHexString()

//
// ==================
// Entidad - Student
// ==================

// Se intenta obtener de la blockchain
let student = Student.load(event.params.studentId)

// Si no existe, se crea
if (!student) {
  student = new Student(event.params.studentId)
  student.activityId = event.params.activityId
  student.activities = [event.params.activityId]
}

student.activities.push(event.params.activityId)

// De manera auxiliar añadimos como parametro el Id que le fijamos al usuario
// TODO : Utilizar este Id como Id? 
//student.studentId = event.address.toString()
//student.address = event.address.toHexString()


// ==================
// Entidad - Address
// ==================

// Se intenta obtener de la blockchain
let direccion = Direccion.load(event.address.toHex())

// Si no existe, se crea
if (!direccion) {
  direccion = new Direccion(event.address.toHex())
  direccion.activities = [event.params.activityId]
  //direccion.studentId = [event.params.studentId]
}

direccion.activities2.push(event.params.activityId)
direccion.activities.concat([event.params.activityId])
//direccion.studentId.concat([event.params.studentId])

activity.save()
student.save()
direccion.save()

  // Comentarios acerca de la accesibilidad de los contratos desde el mapping

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.getActivityEnrollmentCount(...)
  // - contract.getActivityEnrollmentCount(...)
  // - contract.getEnrollmentCount(...)
  // - contract.getOwner(...)
  // - contract.getTotalActivities(...)
  // - contract.getTotalStudents(...)
}*/
