import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contact, CreateContactDto } from '../types/index'
import { contactService } from '../services/contactService'

export const useContactStore = defineStore('contact', () => {
  const contacts = ref<Contact[]>([])

  function load(): void {
    contacts.value = contactService.list()
  }

  function add(dto: CreateContactDto): Contact {
    const contact = contactService.add(dto)
    contacts.value = contactService.list()
    return contact
  }

  function update(id: string, dto: Partial<CreateContactDto>): Contact {
    const contact = contactService.update(id, dto)
    contacts.value = contactService.list()
    return contact
  }

  function remove(id: string): void {
    contactService.remove(id)
    contacts.value = contactService.list()
  }

  return { contacts, load, add, update, remove }
})
