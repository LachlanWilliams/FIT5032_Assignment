<template>
    <div class="card flex justify-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>

<script setup>
import Chart from "primevue/chart";
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

const userRole = ref([]);
const carerRole = ref([]);
const adminRole = ref([]);

const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const allUsers = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  userRole.value = allUsers.filter(user => user.role === 'user');
  carerRole.value = allUsers.filter(user => user.role === 'carer');
  adminRole.value = allUsers.filter(user => user.role === 'admin');

  // After fetching users, update the chart data
  chartData.value = setChartData();
};

onMounted(() => {
    fetchUsers();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Users', 'Carers', 'Admins'],
        datasets: [
            {
                data: [userRole.value.length, carerRole.value.length, adminRole.value.length], // Use the lengths of the arrays
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-cyan-500'), 
                    documentStyle.getPropertyValue('--p-orange-500'), 
                    documentStyle.getPropertyValue('--p-gray-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-cyan-400'), 
                    documentStyle.getPropertyValue('--p-orange-400'), 
                    documentStyle.getPropertyValue('--p-gray-400')
                ]
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
};
</script>