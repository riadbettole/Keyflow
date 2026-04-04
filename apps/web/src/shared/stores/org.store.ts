import { create } from 'zustand'

type Org = {
	id: string
	name: string
	slug: string
}

type OrgStore = {
	activeOrg: Org | null
	setActiveOrg: (org: Org | null) => void
}

export const useOrgStore = create<OrgStore>((set) => ({
	activeOrg: null,
	setActiveOrg: (org) => set({ activeOrg: org }),
}))
