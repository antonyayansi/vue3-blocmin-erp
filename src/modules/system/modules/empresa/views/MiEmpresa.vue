<template>
    <Loading :show="isLoading" title="Cargando..." />
    <div v-if="empresa" class="bg-white dark:bg-zinc-900 shadow-sm pb-8 rounded-md  ">
        <div class="w-full h-[150px] static bg-gradient-to-r rounded-t-md from-primary-500 to-skin-secondary">
            <div class="relative left-4 top-28">
                <label v-if="!new_empresa_edit.logo_url"
                    class="rounded-full bg-zinc-200 border-4 border-white dark:border-zinc-900 dark:bg-zinc-800 h-28 w-28 flex justify-center items-center  ">
                    <input accept="image/*" type="file" class="hidden" @change="onChangeLogo" ref="logo">
                    <i class="pi pi-building text-6xl text-zinc-700 dark:text-white  " />
                </label>
                <label v-else>
                    <input accept="image/*" type="file" class="hidden" @change="onChangeLogo" ref="logo">
                    <img :src="new_empresa_edit.logo_url" alt=""
                        class="rounded-full h-28 w-28 border-4 border-white dark:border-zinc-900  ">
                </label>
            </div>
        </div>
        <div class="pl-36">
            <h1 class="font-black text-xl text-zinc-800 dark:text-white  ">{{
                empresa.razon_social }}</h1>
            <p class="text-zinc-600 dark:text-zinc-400  ">
                <i class="pi pi-id-card" /> {{ empresa.ruc }}
            </p>
        </div>
    </div>
    <Panel header="Información General" class="mt-2">
        <Tabs value="0">
            <TabList>
                <Tab value="0">General</Tab>
                <Tab value="2">Feriados</Tab>
                <Tab value="3">Licencia</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <form class="w-full flex flex-wrap" @submit.prevent="putEmpresa()">
                        <div class="w-full md:w-1/3 pr-0 md:pr-2">
                            <label for="ruc" class="text-zinc-600 text-xs dark:text-zinc-400 ">RUC</label>
                            <InputText v-model="new_empresa_edit.ruc" disabled size="small" fluid />
                        </div>
                        <div class="w-full md:w-2/3">
                            <label for="razon_social" class="text-zinc-600 text-xs dark:text-zinc-400">Razón
                                Social</label>
                            <InputText v-model="new_empresa_edit.razon_social" size="small" fluid />
                        </div>
                        <div class="w-full sm:w-full md:w-1/2 lg:w-3/5 pr-0 md:pr-2">
                            <label for="direccion" class="text-zinc-600 text-xs dark:text-zinc-400  ">Dirección</label>
                            <InputText v-model="new_empresa_edit.direccion" size="small" fluid />
                        </div>
                        <div class="w-1/2 md:w-1/4 lg:w-1/5 pr-2">
                            <label for="telefono" class="text-zinc-600 text-xs dark:text-zinc-400  ">Teléfono</label>
                            <InputText v-model="new_empresa_edit.telefono" size="small" fluid />
                        </div>
                        <div class="w-1/2 md:w-1/4 lg:w-1/5">
                            <label for="email" class="text-zinc-600 text-xs dark:text-zinc-400  ">Email</label>
                            <InputText v-model="new_empresa_edit.email" size="small" fluid />
                        </div>
                        <div class="w-full sm:w-1/3 md:w-1/4 pr-0 sm:pr-2">
                            <label for="departamento"
                                class="text-zinc-600 text-xs dark:text-zinc-400  ">Departamento</label>
                            <InputText v-model="new_empresa_edit.departamento" size="small" fluid />
                        </div>
                        <div class="w-full sm:w-1/3 md:w-1/4 pr-0 sm:pr-2">
                            <label for="provincia" class="text-zinc-600 text-xs dark:text-zinc-400  ">Provincia</label>
                            <InputText v-model="new_empresa_edit.provincia" size="small" fluid />
                        </div>
                        <div class="w-full sm:w-1/3 md:w-1/4 pr-0 sm:pr-2">
                            <label for="distrito" class="text-zinc-600 text-xs dark:text-zinc-400  ">Distrito</label>
                            <InputText v-model="new_empresa_edit.distrito" size="small" fluid />
                        </div>
                        <div class="w-full md:w-1/4">
                            <label for="ubigueo" class="text-zinc-600 text-xs dark:text-zinc-400  ">Ubigueo</label>
                            <InputText v-model="new_empresa_edit.ubigueo" size="small" fluid />
                        </div>
                        <div class="w-full md:w-1/2 pr-2">
                            <label for="ubigueo" class="text-zinc-600 text-xs dark:text-zinc-400  ">Mensaje</label>
                            <InputText v-model="new_empresa_edit.mensaje" size="small" fluid />
                        </div>
                        <div class="w-full md:w-1/4">
                            <label for="pass_cdt" class="text-zinc-600 text-xs dark:text-zinc-400  ">Control
                                Stock</label>
                            <label v-if="new_empresa_edit.control_stock == 0"
                                @click="new_empresa_edit.control_stock = 1"
                                class="flex items-center relative w-max cursor-pointer select-none">
                                <input type="checkbox"
                                    class="appearance-none   cursor-pointer w-[66px] h-7 rounded-full bg-skin-warning" />
                                <span class="absolute font-medium text-xs uppercase right-3 text-white"> NO </span>
                                <span
                                    class="w-7 h-7 absolute left-0 rounded-full transform transition-transform bg-zinc-200" />
                            </label>
                            <label v-else-if="new_empresa_edit.control_stock == 1"
                                @click="new_empresa_edit.control_stock = 0"
                                class="flex items-center relative w-max cursor-pointer select-none">
                                <input type="checkbox"
                                    class="appearance-none   cursor-pointer w-[58px] h-7 rounded-full bg-skin-success" />
                                <span class="absolute font-medium text-xs uppercase left-3 text-white"> SI </span>
                                <span
                                    class="w-7 h-7 absolute right-0 rounded-full transform transition-transform bg-zinc-200" />
                            </label>
                        </div>
                        <div class="mt-2 w-full">
                            <Button label="Guardar" icon="pi pi-save" :loading="isLoading" size="small"
                                @click="putEmpresa()" />
                        </div>
                    </form>
                </TabPanel>
                <TabPanel value="1">
                    <div class="w-full flex flex-wrap py-2">
                        <div class="w-1/2 md:w-1/4 pr-2">
                            <label for="igv" class="text-zinc-600 text-xs dark:text-zinc-400  ">IGV
                                (%)</label>
                            <input placeholder="igv" step="0.01" v-model="new_empresa_edit.igv" type="number"
                                class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                        </div>
                        <div class="w-1/2 md:w-1/4 pr-2">
                            <label for="usuario_sol" class="text-zinc-600 text-xs dark:text-zinc-400  ">Usuario
                                SOL</label>
                            <input placeholder="Usuario SOL" v-model="new_empresa_edit.usuario_sol" type="text"
                                class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                        </div>
                        <div class="w-1/2 md:w-1/4 pr-2">
                            <label for="pass_sol" class="text-zinc-600 text-xs dark:text-zinc-400  ">Clave
                                SOL</label>
                            <input placeholder="Clave SOL" v-model="new_empresa_edit.pass_sol" type="password"
                                class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                        </div>
                        <div class="w-1/2 md:w-1/4">
                            <label for="pass_cdt" class="text-zinc-600 text-xs dark:text-zinc-400  ">Clave
                                CDT
                                <i class="pi pi-key" />
                            </label>
                            <input placeholder="Clave de Certificado Digital" v-model="new_empresa_edit.pass_cdt"
                                type="password"
                                class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                        </div>
                        <div class="w-full md:w-3/4 pr-0 md:pr-2">
                            <label for="cdt" class="text-zinc-600 text-xs dark:text-zinc-400  ">Sube tu
                                certificado</label>
                            <label>
                                <input @change="onChangeCertificado" hidden type="file" accept=".pem">
                                <div v-if="!new_empresa_edit.certificado_url"
                                    class="p-2 border-2 border-dashed dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-primary-500 dark:hover:border-primary-500  ">
                                    <i class="pi pi-cloud-upload" /> Certificado digital (.pem)
                                </div>
                                <div v-else title="Haga click para cambiar el certificado"
                                    class="border text-primary-500 font-medium bg-white dark:bg-zinc-800 p-2 rounded-md dark:border-zinc-700  ">
                                    <h1>
                                        <i class="pi pi-key" /> Certificado Activa
                                    </h1>
                                </div>
                            </label>
                        </div>
                        <div class="w-full md:w-1/4">
                            <label for="pass_cdt" class="text-zinc-600 text-xs dark:text-zinc-400  ">Estado</label>
                            <label v-if="new_empresa_edit.envio_sunat == 0" @click="new_empresa_edit.envio_sunat = 1"
                                class="flex items-center relative w-max cursor-pointer select-none">
                                <input type="checkbox"
                                    class="appearance-none   cursor-pointer w-[88px] h-7 rounded-full bg-skin-warning" />
                                <span class="absolute font-medium text-xs uppercase right-3 text-white"> PRUEBA </span>
                                <span
                                    class="w-7 h-7 absolute left-0 rounded-full transform transition-transform bg-zinc-200" />
                            </label>
                            <label v-else-if="new_empresa_edit.envio_sunat == 1"
                                @click="new_empresa_edit.envio_sunat = 0"
                                class="flex items-center relative w-max cursor-pointer select-none">
                                <input type="checkbox"
                                    class="appearance-none   cursor-pointer w-[92px] h-7 rounded-full bg-skin-success" />
                                <span class="absolute font-medium text-xs uppercase left-3 text-white"> PRODUC. </span>
                                <span
                                    class="w-7 h-7 absolute right-0 rounded-full transform transition-transform bg-zinc-200" />
                            </label>
                        </div>
                        <div>
                            <p class="pt-2 text-xs text-zinc-500">
                                Si no tienes un certificado digital, puedes obtenerlo en <a
                                    href="https://www.sunat.gob.pe/" target="_blank"
                                    class="text-primary-500 hover:underline  ">SUNAT</a>
                            </p>
                        </div>
                        <div class="mt-2 w-full">
                            <Button label="Guardar" icon="pi pi-save" :loading="isLoading" size="small"
                                @click="putEmpresa()" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <form class="w-full flex flex-wrap mb-4" @submit.prevent="onSubmitFeriado()">
                        <div class="w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 pr-0 sm:pr-2">
                            <label for="ruc" class="text-zinc-600 text-xs dark:text-zinc-400">Fecha</label>
                            <InputText v-model="new_feriado.fecha" type="date" size="small" fluid />
                        </div>
                        <div class="w-full sm:w-2/3 lg:w-3/4 xl:w-4/5 pr-0 sm:pr-2">
                            <label for="ruc" class="text-zinc-600 text-xs dark:text-zinc-400">Nombre</label>
                            <InputText v-model="new_feriado.nombre" placeholder="Nombre de feriado" size="small"
                                fluid />
                        </div>
                        <div class="w-full mt-2">
                            <Button label="Agregar" icon="pi pi-plus" :loading="isLoading" size="small"
                                @click="onSubmitFeriado()" />
                        </div>
                    </form>
                    <div class="relative overflow-x-auto">
                        <table class="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-400    ">
                            <thead
                                class="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400    ">
                                <tr>
                                    <th scope="col" class="px-4 py-2">
                                        Dia
                                    </th>
                                    <th scope="col" class="px-4 py-2">
                                        Mes
                                    </th>
                                    <th scope="col" class="px-4 py-2">
                                        Nombre
                                    </th>
                                    <th scope="col" class="px-4 py-2">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="feriado in feriados" :key="feriado"
                                    class="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700    ">
                                    <th scope="row"
                                        class="px-4 py-2 font-medium text-zinc-900 whitespace-nowrap dark:text-white    ">
                                        {{ feriado.dia }}
                                    </th>
                                    <td class="px-4 py-2">
                                        {{ mes[parseInt(feriado.mes) - 1] }}
                                    </td>
                                    <td class="px-4 py-2">
                                        {{ feriado.nombre }}
                                    </td>
                                    <td class="px-4 py-2">
                                        <button @click="deleteFeriado(feriado.id)" class="text-red-500 hover:underline">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel value="3">
                    <Licencia />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Panel>
</template>

<script setup>
import { onMounted } from 'vue';
import useSystem from '../../../hooks/useSystem';
import useEmpresa from '../hooks/useEmpresa';
import { baseApi } from '../../../../../services/baseApi';
import { toast } from 'vue-sonner';
import Loading from '@/components/Loading.vue';
import Licencia from './Licencia.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Panel from 'primevue/panel';

const {
    activeEmpresa: empresa
} = useSystem()

let mes = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Setiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

const {
    new_empresa_edit,
    getEmpresaById,
    putEmpresa,
    isLoading,
    getFeriados,
    feriados,
    onSubmitFeriado,
    new_feriado,
    deleteFeriado,
    step
} = useEmpresa()

const onChangeLogo = async (e) => {
    new_empresa_edit.value.logo_url = URL.createObjectURL(e.target.files[0])
    new_empresa_edit.value.logo = e.target.files[0]
    const formData = new FormData()
    formData.append('logo', new_empresa_edit.value.logo)
    await baseApi.post(`empresalogo/${new_empresa_edit.value.id}?_method=PUT`, formData)
}

const onChangeCertificado = async (e) => {
    new_empresa_edit.value.certificado_url = URL.createObjectURL(e.target.files[0])
    new_empresa_edit.value.certificado = e.target.files[0]
    const formData = new FormData()
    formData.append('certificado', new_empresa_edit.value.certificado)
    try {
        const { data } = await baseApi.post(`empresacertificado/${new_empresa_edit.value.id}?_method=PUT`, formData)
        toast.success(data.message)
    } catch (e) {
        toast.error(e.response.data.message)
    }
}

onMounted(async () => {
    await getEmpresaById(empresa.value.id)
    getFeriados()
})

</script>

<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>