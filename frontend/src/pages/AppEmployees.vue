<script setup lang="ts">
    import axios from 'axios';
    import { ref, onMounted } from 'vue';

    var employeesData = ref([]);
    const clients = ref([]);

    onMounted(async () => {
        const response = await axios.get('http://localhost:3000/employee');
        employeesData.value = response.data.sort((a, b) => a.id - b.id);
        employeesData.value.forEach(employee => {
                employee.lastLogin = new Date(employee.lastLogin).toLocaleDateString();
        });
        const clientsResponse = await axios.get('http://localhost:3000/customers');
        clients.value = clientsResponse.data;
    });
    var visible = ref(false);

    var selectedClients = ref([]);
    var oldSelectedClients = ref([]);
    var currentEmployeeId = ref(0);

    const enterEdit = async (id : number) => {
        const customersListResponse = await axios.get('http://localhost:3000/employee/' + id + '/customerslist');
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
                await axios.put('http://localhost:3000/employee/' + id + '/customerslist/add/' + selectedClient);
            }
        }
        for (let oldSelectedClient of oldSelectedClients.value) {
            if (!selectedClients.value.includes(oldSelectedClient)) {
                console.log('Client Removed id ' + oldSelectedClient);
                await axios.put('http://localhost:3000/employee/' + id + '/customerslist/remove/' + oldSelectedClient);
            }
        }
        selectedClients.value = [];
        oldSelectedClients.value = [];
        currentEmployeeId.value = 0;
        visible.value = false;
    };
</script>

<template>
    <div>
        <h1>Coaches</h1>
        <hr />
        <div class="p-7">
            <PrimeDataTable :value="employeesData" showGridlines scrollable scrollHeight="700px">
                <PrimeColumn field="id" sortable header="#"></PrimeColumn>
                <PrimeColumn field="name" sortable header="Name"></PrimeColumn>
                <PrimeColumn field="surname" sortable header="Surname"></PrimeColumn>
                <PrimeColumn field="birthdate" sortable header="Birth Date"></PrimeColumn>
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
                <PrimeColumn field="lastLogin" sortable header="Last connection"></PrimeColumn>
            </PrimeDataTable>
        </div>
    </div>
</template>

<style scoped>

</style>
