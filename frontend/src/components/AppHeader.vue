<script setup lang="ts">
	import axios from 'axios';
	import { ref, onMounted } from 'vue';
	import { useConfirm } from "primevue/useconfirm";
	import { useToast } from "primevue/usetoast";
	import Badge from 'primevue/badge';
	import router from '@/router';
	import checkToken from '../services/TokenService';

	const confirm = useConfirm();
	const toast = useToast();
	const op = ref();

	const tabs = ref([
		{ label: 'Dashboard', icon: 'pi pi-fw pi-home', route: '/home' },
		{ label: 'Coaches', icon: 'pi pi-fw pi-users', route: '/employees' },
		{ label: 'Customers', icon: 'pi pi-fw pi-users', route: '/customers' },
		{ label: 'Wardrobe', icon: 'pi pi-fw pi-cog', route: '/wardrobe' },
		{ label: 'Compatibility', icon: 'pi pi-fw pi-heart', route: '/astrological' },
		{ label: 'Tips', icon: 'pi pi-fw pi-book', route: '/tips' },
		{ label: 'Statistics', icon: 'pi pi-fw pi-chart-bar', route: '/statistics' },
		{ label: 'Events', icon: 'pi pi-fw pi-map', route: '/events' }
	]);
	const username = ref("John Doe");
	const email = ref("");
	const customerData = ref([]);
	const image = ref("a");

	const toggle = (event: any) => {
		op.value.toggle(event);
	};

	const logout = (event : any) => {
		confirm.require({
			message: 'Are you sure you want to logout?',
			header: 'Confirmation',
			icon: 'pi pi-exclamation-triangle',
			rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
			acceptClass: 'p-button-danger p-button-sm',
			rejectLabel: 'Cancel',
			acceptLabel: 'Confirm',
			accept: () => {
				toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have been logout', life: 3000 });
				localStorage.removeItem('token');
				router.push('/');
			},
			reject: () => {
				toast.add({ severity: 'error', summary: 'Rejected', detail: 'You are still logged in', life: 3000 });
			}
		});
	};

	onMounted(async () => {
		if (!await checkToken()) {
			router.push('/');
			return;
		}
		const token = localStorage.getItem('token');
		const response = await axios.get('http://localhost:3000/employee/me', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		customerData.value = response.data;
		username.value = customerData.value.name + ' ' + customerData.value.surname || 'John Doe';
		email.value = customerData.value.email || 'email';
		const responseImage = await axios.get('http://localhost:3000/employee/me/image', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		image.value = "data:image/png;base64," + responseImage.data;
	});
</script>

<template>
    <PrimeMenuBar :model="tabs" class="border-noround">
		<template #start>
			<div class="font-bold text-3xl">
				Soul Connection
			</div>
		</template>

		<template #item="{ item, props }">
			<router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
				<a v-ripple class="flex align-items-center" :href="href" v-bind="props.action" @click="navigate">
					<span :class="item.icon"></span>
					<span class="ml-2">{{ item.label }}</span>
					<Badge v-if="item.badge"  :value="item.badge" />
					<span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
				</a>
			</router-link>
		</template>

		<template #end>
			<div class="flex align-items-center md:gap-4">
				<PrimeAvatar image="https://i.ibb.co/748L85b/usa.png" shape="circle" size="medium" class="mr-2" />
				<PrimeButton outlined class="border-2" @click="toggle($event)">
					<PrimeAvatar icon="pi pi-user" shape="circle" size="medium" class="" />
				</PrimeButton>

				<PrimeOverlayPanel ref="op">
					<div class="flex flex-column justify-content-center gap-3 w-25rem">
						<div class="flex flex-row gap-2 justify-content-around">
							<PrimeAvatar :image=image shape="circle" size="xlarge" class="" />
							<div class="flex flex-column justify-content-center">
								<span class="font-medium text-900 block mb-2 flex align-items-center justify-content-center">{{ username }}</span>
								<span class="font-light text-900 block mb-2 font-italic flex align-items-center justify-content-center">{{ email }}</span>
								<PrimeToast />
								<PrimeConfirmDialog></PrimeConfirmDialog>
								<PrimeButton label="Logout" icon="pi pi-sign-out" class="p-button-danger" @click="logout($event)" />
							</div>
						</div>
					</div>
				</PrimeOverlayPanel>

			</div>
		</template>
	</PrimeMenuBar>
</template>

<style>
	.p-menubar-root-list {
		margin-left: auto;
		margin-right: auto;
	}
</style>
