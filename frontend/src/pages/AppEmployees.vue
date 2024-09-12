<script setup lang="ts">
    import axios from 'axios';
    import { ref, onMounted } from 'vue';
    import router from '../router/index';
    import checkToken from '../services/TokenService';
    import { useToast } from 'primevue/usetoast';

	const API_URL = process.env.VUE_APP_BACKEND_URL;
    var employeesData = ref([]);
    const clients = ref([]);
    const token = ref();
    const createDialogVisible = ref(false);
    const toast = useToast();

    const newCoachPassword = ref('');
    const newCoachName = ref('');
    const newCoachSurname = ref('');
    const newCoachEmail = ref('');
    const newCoachBirthdate = ref('');

    onMounted(async () => {
		if (!await checkToken()) {
			router.push('/');
			return;
		}
        token.value = localStorage.getItem('token');
        const isManager = await axios.get(API_URL + '/token/ismanager', {
            headers : {
            Authorization: `Bearer ${token.value}`
            }
        });
        if (!isManager.data) {
            router.push('/home');
            return;
        }
        const response = await axios.get(API_URL + '/employee', {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            });
        employeesData.value = response.data.sort((a, b) => a.id - b.id);
        employeesData.value.forEach(employee => {
                employee.lastLogin = new Date(employee.lastLogin).toLocaleDateString();
        });
        const clientsResponse = await axios.get(API_URL + '/customers', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        });
        clients.value = clientsResponse.data;
    });
    var visible = ref(false);

    var selectedClients = ref([]);
    var oldSelectedClients = ref([]);
    var currentEmployeeId = ref(0);

    const enterEdit = async (id : number) => {
        const customersListResponse = await axios.get(API_URL + '/employee/' + id + '/customerslist', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        });
        selectedClients.value = customersListResponse.data.map(client => client.id);
        oldSelectedClients.value = customersListResponse.data.map(client => client.id);
        visible.value = true;
        currentEmployeeId.value = id;
    };

    const cancelEdit = () => {
        selectedClients.value = [];
        oldSelectedClients.value = [];
        currentEmployeeId.value = 0;
        visible.value = false;
    };

    const updateEdit = async () => {
        const id = currentEmployeeId.value;
        for (let selectedClient of selectedClients.value) {
            if (!oldSelectedClients.value.includes(selectedClient)) {
                console.log('Client Added id ' + selectedClient);
                await axios.put(API_URL + '/employee/' + id + '/customerslist/add/' + selectedClient, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.value}`
                    }
                });
            }
        }
        for (let oldSelectedClient of oldSelectedClients.value) {
            if (!selectedClients.value.includes(oldSelectedClient)) {
                console.log('Client Removed id ' + oldSelectedClient);
                await axios.put(API_URL + '/employee/' + id + '/customerslist/remove/' + oldSelectedClient, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.value}`
                    }
                });
            }
        }
        selectedClients.value = [];
        oldSelectedClients.value = [];
        currentEmployeeId.value = 0;
        visible.value = false;
        location.reload();
    };

    const cancelCreateCoach = () => {
        newCoachName.value = '';
        newCoachSurname.value = '';
        newCoachEmail.value = '';
        newCoachBirthdate.value = '';
        newCoachPassword.value = '';
        createDialogVisible.value = false;
    };

    const createCoach = async () => {
        if (!newCoachName.value || !newCoachSurname.value || !newCoachEmail.value || !newCoachBirthdate.value || !newCoachPassword.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the fields', life: 3000 });
            return;
        }
        const response = await axios.post(API_URL + '/employee', {
            name: newCoachName.value,
            surname: newCoachSurname.value,
            email: newCoachEmail.value,
            birthdate: newCoachBirthdate.value,
            password: newCoachPassword.value
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        });
        createDialogVisible.value = false;
        location.reload();
    };
</script>

<template>
	<AppHeader />

    <PrimeToast />
    <div>
        <div class="flex flex-row justify-content-between m-0 pt-5 px-4 md:px-7 md:pt-3">
            <h1 class="">Coaches</h1>
            <PrimeButton label="Add new coach" icon="pi pi-plus" class="p-button-rounded p-button-info my-2" @click="createDialogVisible = true"></PrimeButton>
            <PrimeDialog v-model:visible="createDialogVisible" modal header="Edit Profile" :style="{ width: 'auto' }">
                <template #header>
                    <div class="inline-flex align-items-center justify-content-center gap-2">
                        <span class="font-bold white-space-nowrap">Create a new coach</span>
                    </div>
                </template>
                <span class="p-text-secondary block mb-5">Enter the information of the new coach</span>
                <div class="flex flex-column md:flex-row gap-3 mb-3">
                    <div class="flex flex-column gap-2">
                        <label for="name" class="font-semibold w-6rem">Name</label>
                        <InputText id="name" class="flex-auto" autocomplete="off" v-model="newCoachName"/>
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="surname" class="font-semibold w-6rem">Surname</label>
                        <InputText id="surname" class="flex-auto" autocomplete="off" v-model="newCoachSurname"/>
                    </div>
                </div>
                <div class="flex flex-column gap-2 mb-3">
                    <label for="email" class="font-semibold w-6rem">Email</label>
                    <InputText id="email" class="flex-auto" autocomplete="off" v-model="newCoachEmail"/>
                </div>
                <div class="flex flex-column gap-2 mb-3">
                    <label for="birthdate" class="font-semibold">Birth Date (year-month-day)</label>
                    <InputText id="birthdate" class="flex-auto" autocomplete="off" v-model="newCoachBirthdate"/>
                </div>
                <div class="flex flex-column gap-2 mb-3">
                    <label for="password" class="font-semibold">Password</label>
                    <PrimePassword v-model="newCoachPassword" :feedback="false" class="flex-auto" />
                </div>
                <template #footer>
                    <PrimeButton label="Cancel" class="p-button-secondary p-button-outlined p-button-sm" @click="cancelCreateCoach()" />
                    <PrimeButton label="Create" class="p-button-success p-button-sm" @click="createCoach()" />
                </template>
            </PrimeDialog>
        </div>
        <div class="px-3 py-4 md:px-7 md:py-5">
            <PrimeDataTable :value="employeesData" showGridlines scrollable scrollHeight="700px">
                <PrimeColumn field="id" sortable header="#"></PrimeColumn>
                <PrimeColumn field="name" sortable header="Name"></PrimeColumn>
                <PrimeColumn field="surname" sortable header="Surname"></PrimeColumn>
                <PrimeColumn field="email" sortable header="Email"></PrimeColumn>
                <PrimeColumn field="birthdate" sortable header="Birth Date"></PrimeColumn>
                <PrimeColumn field="clientNbr" sortable header="Number of customers"></PrimeColumn>
                <PrimeColumn>
                    <template #header>
                        <div>Customers</div>
                    </template>
                    <template #body="slotProps">
                        <div v-if="slotProps.data.work !== 'Coach'">
                            <span class="p-text-secondary">This employee is not a coach</span>
                        </div>
                        <div v-else>
                            <PrimeButton icon="pi pi-pen-to-square" label="Edit coach customers" severity="info" rounded aria-label="User" @click="enterEdit(slotProps.data.id)"></PrimeButton>

                            <PrimeDialog v-model:visible="visible" modal header="Edit coach customers" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                                <span class="p-text-secondary block mb-5">Select the customers that you want to assign to this coach</span>

                                <div class="flex flex-column gap-4 px-4 pb-4">
                                    <div v-for="client of clients" :key="client.id" class="flex items-center gap-2">
                                        <PrimeCheckbox v-model="selectedClients" name="client" :value="client.id"></PrimeCheckbox>
                                        <label :for="client.id">{{ client.name }} {{ client.surname }}</label>
                                    </div>
                                </div>

                                <div class="flex justify-content-end gap-2">
                                    <PrimeButton type="button" label="Cancel" severity="secondary" @click="cancelEdit()"></PrimeButton>
                                    <PrimeButton type="button" label="Save" @click="updateEdit()"></PrimeButton>
                                </div>
                            </PrimeDialog>
                        </div>
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>
    </div>
</template>

<style scoped>

</style>
