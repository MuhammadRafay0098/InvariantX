import { randomUUID } from "node:crypto";

export function createRunId(): string {
  return `RUN-${randomUUID()}`;
}

export function createTraceId(): string {
  return `TRACE-${randomUUID()}`;
}

export function createIncidentId(): string {
  return `INC-${randomUUID()}`;
}

export function createInvariantId(): string {
  return `INV-${randomUUID()}`;
}

export function createTransferId(): string {
  return `TR-${randomUUID()}`;
}

export function createPolicyId(): string {
  return `POL-${randomUUID()}`;
}

export function createValidationRunId(): string {
  return `VAL-${randomUUID()}`;
}
