import type { Contact, CreateContactDto } from '../types/index'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

const MAX_CONTACTS = 5

function load(): Contact[] {
  return getStorage<Contact[]>(STORAGE_KEYS.SILVER_CONTACTS) ?? []
}

function save(contacts: Contact[]): void {
  setStorage(STORAGE_KEYS.SILVER_CONTACTS, contacts)
}

function list(): Contact[] {
  return load()
}

function validate(phone: string): boolean {
  return /^1\d{10}$/.test(phone)
}

function add(dto: CreateContactDto): Contact {
  const contacts = load()
  if (contacts.length >= MAX_CONTACTS) {
    throw new Error(`最多添加 ${MAX_CONTACTS} 位紧急联系人`)
  }
  if (!validate(dto.phone)) {
    throw new Error('请输入正确的手机号码')
  }
  const contact: Contact = {
    ...dto,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  }
  contacts.push(contact)
  save(contacts)
  return contact
}

function update(id: string, dto: Partial<CreateContactDto>): Contact {
  const contacts = load()
  const idx = contacts.findIndex(c => c.id === id)
  if (idx === -1) throw new Error('联系人不存在')
  if (dto.phone && !validate(dto.phone)) {
    throw new Error('请输入正确的手机号码')
  }
  contacts[idx] = { ...contacts[idx], ...dto }
  save(contacts)
  return contacts[idx]
}

function remove(id: string): void {
  const contacts = load().filter(c => c.id !== id)
  save(contacts)
}

export const contactService = { list, add, update, remove, validate }
