<template>
    <div class="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-x-hidden transition-colors duration-300">

        <!-- NAVBAR -->
        <nav class="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-white/10">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="">
                        <img src="/img/logo.png" alt="Logo" class="w-9 h-9 rounded-xl">
                    </div>
                    <div class="hidden md:block">
                        <span class="font-black text-lg tracking-tight text-neutral-900 dark:text-white">ERP CCore</span>
                        <span class="ml-2 text-xs text-sky-500 dark:text-sky-400 font-semibold uppercase tracking-widest">by Blocmin</span>
                    </div>
                </div>
                <div class="hidden md:flex items-center gap-8 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    <a href="#modulos" class="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Módulos</a>
                    <a href="#beneficios" class="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Beneficios</a>
                    <a href="#contacto" class="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Contacto</a>
                </div>
                <div class="flex items-center gap-3">
                    <!-- Dark/Light toggle -->
                    <button @click="toggleDark()"
                        class="w-9 h-9 rounded-xl flex items-center justify-center border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all"
                        :title="isDark ? 'Modo claro' : 'Modo oscuro'">
                        <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-sm"></i>
                    </button>
                    <a :href="whatsappUrl" target="_blank">
                        <Button label="Cotizar" icon="pi pi-whatsapp" text severity="success"></Button>
                    </a>
                    <a href="/login">
                        <Button label="Acceder" icon="pi pi-sign-in"></Button>
                    </a>
                </div>
            </div>
        </nav>

        <!-- HERO -->
        <section class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            <!-- Mesh gradient background -->
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-white dark:bg-neutral-950"></div>
                <div class="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/15 dark:bg-sky-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-400/15 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style="animation-delay:1s"></div>
                <div class="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400/10 dark:bg-violet-600/15 rounded-full blur-3xl animate-pulse" style="animation-delay:2s"></div>
                <!-- Grid -->
                <div class="absolute inset-0 opacity-30 dark:opacity-10" style="background-image:linear-gradient(rgba(100,116,139,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(100,116,139,0.15) 1px,transparent 1px);background-size:60px 60px"></div>
            </div>

            <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                    Sistema ERP empresarial · Blocmin
                </div>

                <h1 class="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
                    <span class="text-neutral-900 dark:text-white">Gestiona tu empresa</span><br>
                    <span class="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 dark:from-sky-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">con ERP CCore</span>
                </h1>

                <p class="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                    Plataforma ERP integral para créditos, ventas, hoteles, proyectos, inventario, personal y más.
                    Todo en un solo sistema, rápido, moderno y seguro.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/login"
                        class="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-lg hover:from-sky-400 hover:to-indigo-500 transition-all shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Acceder al Sistema
                    </a>
                    <a :href="whatsappUrl" target="_blank"
                        class="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold text-lg hover:bg-emerald-500/20 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all hover:scale-105">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Cotizar ahora
                    </a>
                </div>

                <!-- Stats -->
                <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div v-for="stat in stats" :key="stat.label" class="p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-sm">
                        <div class="text-3xl font-black text-neutral-900 dark:text-white">{{ stat.value }}</div>
                        <div class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- MÓDULOS -->
        <section id="modulos" class="py-24 px-6 relative">
            <div class="absolute inset-0 bg-gradient-to-b from-white via-neutral-50/80 to-white dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950 pointer-events-none"></div>
            <div class="relative max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <span class="text-sky-500 dark:text-sky-400 font-bold text-sm uppercase tracking-widest">Funcionalidades</span>
                    <h2 class="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mt-3 mb-4">Todo lo que necesitas,<br><span class="text-neutral-500 dark:text-neutral-400">en un solo sistema</span></h2>
                    <p class="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">Módulos integrados que cubren cada área de tu empresa, desde las finanzas hasta la gestión del personal.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="mod in modules" :key="mod.title"
                        class="group relative p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/8 backdrop-blur-sm hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
                        :class="mod.featured ? 'border-sky-300 dark:border-sky-500/40 bg-sky-50 dark:bg-sky-950/30 hover:border-sky-400 dark:hover:border-sky-400/60' : ''">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                            :style="`background: ${mod.color}20; box-shadow: 0 0 20px ${mod.color}15`">
                            {{ mod.icon }}
                        </div>
                        <div v-if="mod.featured" class="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-600 dark:text-sky-400 text-xs font-bold">Popular</div>
                        <h3 class="text-neutral-900 dark:text-white font-bold text-lg mb-2">{{ mod.title }}</h3>
                        <p class="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-4">{{ mod.desc }}</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="tag in mod.tags" :key="tag"
                                class="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-200 dark:bg-white/8 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-white/10">
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- BENEFICIOS -->
        <section id="beneficios" class="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/40">
            <div class="max-w-7xl mx-auto">
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span class="text-indigo-500 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest">¿Por qué ERP CCore?</span>
                        <h2 class="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mt-3 mb-6">Tecnología de punta<br><span class="text-neutral-500 dark:text-neutral-400">para tu negocio</span></h2>
                        <p class="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">Diseñado para empresas que buscan eficiencia, control y crecimiento. ERP CCore integra todos los procesos en una sola plataforma moderna.</p>
                        <div class="space-y-4">
                            <div v-for="b in benefits" :key="b.text" class="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/8 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors shadow-sm dark:shadow-none">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl" :style="`background: ${b.color}20`">{{ b.icon }}</div>
                                <div>
                                    <div class="text-neutral-900 dark:text-white font-semibold">{{ b.text }}</div>
                                    <div class="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5">{{ b.sub }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-3xl blur-2xl"></div>
                        <div class="relative bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl dark:shadow-none">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="flex gap-1.5">
                                    <div class="w-3 h-3 rounded-full bg-red-500/70"></div>
                                    <div class="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                                    <div class="w-3 h-3 rounded-full bg-emerald-500/70"></div>
                                </div>
                                <span class="text-neutral-400 dark:text-neutral-500 text-xs">ERP CCore · Dashboard</span>
                            </div>
                            <div class="space-y-3">
                                <div class="grid grid-cols-3 gap-3">
                                    <div v-for="c in dashCards" :key="c.label" class="p-3 rounded-xl" :style="`background: ${c.color}15; border: 1px solid ${c.color}30`">
                                        <div class="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{{ c.label }}</div>
                                        <div class="font-black text-neutral-900 dark:text-white text-lg">{{ c.val }}</div>
                                        <div class="text-xs mt-0.5" :style="`color: ${c.color}`">{{ c.change }}</div>
                                    </div>
                                </div>
                                <div class="p-4 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/8">
                                    <div class="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Ingresos del mes</div>
                                    <div class="flex items-end gap-1 h-16">
                                        <div v-for="(h, i) in chartBars" :key="i"
                                            class="flex-1 rounded-t-sm transition-all"
                                            :style="`height: ${h}%; background: linear-gradient(to top, #0ea5e9, #6366f1)`">
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <div v-for="item in tableRows" :key="item.name" class="flex items-center justify-between p-2.5 rounded-lg bg-neutral-100 dark:bg-white/5">
                                        <div class="flex items-center gap-2">
                                            <div class="w-6 h-6 rounded-md" :style="`background: ${item.color}30`"></div>
                                            <span class="text-xs text-neutral-600 dark:text-neutral-300">{{ item.name }}</span>
                                        </div>
                                        <span class="text-xs font-bold" :style="`color: ${item.color}`">{{ item.status }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA FINAL -->
        <section id="contacto" class="py-24 px-6 relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-400/10 dark:bg-sky-600/15 rounded-full blur-3xl"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-400/10 dark:bg-indigo-600/15 rounded-full blur-3xl"></div>
            </div>
            <div class="relative z-10 max-w-3xl mx-auto text-center">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-8">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Atención personalizada · WhatsApp
                </div>
                <h2 class="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6">¿Listo para <span class="bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">transformar</span> tu empresa?</h2>
                <p class="text-neutral-500 dark:text-neutral-400 text-xl mb-10">Contáctanos ahora y recibe una cotización personalizada sin compromiso. Nuestro equipo está listo para ayudarte.</p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/login"
                        class="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-lg hover:from-sky-400 hover:to-indigo-500 transition-all shadow-xl shadow-sky-500/30 hover:scale-105">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Acceder al Sistema
                    </a>
                    <a :href="whatsappUrl" target="_blank"
                        class="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/30 hover:scale-105">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Cotizar por WhatsApp
                    </a>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="border-t border-neutral-200 dark:border-white/8 bg-white dark:bg-transparent py-10 px-6">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center font-black text-white text-xs">CC</div>
                    <div>
                        <span class="font-bold text-neutral-900 dark:text-white">ERP CCore</span>
                        <span class="mx-2 text-neutral-400 dark:text-neutral-600">·</span>
                        <span class="text-neutral-500 dark:text-neutral-400 text-sm">by Blocmin</span>
                    </div>
                </div>
                <p class="text-neutral-400 dark:text-neutral-500 text-sm">© {{ new Date().getFullYear() }} Blocmin. Todos los derechos reservados.</p>
                <a :href="whatsappUrl" target="_blank" class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 text-sm font-medium transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    +51 948 347 640
                </a>
            </div>
        </footer>

    </div>
</template>

<script setup>
import { Button } from 'primevue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const whatsappUrl = 'https://wa.me/51948347640?text=Hola!%20Me%20interesa%20cotizar%20el%20ERP%20CCore%20de%20Blocmin.%20%C2%BFPueden%20darme%20m%C3%A1s%20informaci%C3%B3n%3F'

const stats = [
    { value: '10+', label: 'Módulos integrados' },
    { value: '99.9%', label: 'Uptime garantizado' },
    { value: '24/7', label: 'Soporte técnico' },
    { value: '100%', label: 'En la nube' },
]

const modules = [
    {
        icon: '💳',
        title: 'Créditos & Préstamos',
        desc: 'Gestión completa de colocaciones, cronogramas, cobranzas y cuentas por cobrar con reportes en tiempo real.',
        tags: ['Cronograma', 'Cobros', 'Mora', 'Reportes'],
        color: '#0ea5e9',
        featured: true,
    },
    {
        icon: '🧾',
        title: 'Punto de Venta & Facturación',
        desc: 'POS ágil con facturación electrónica, boletas, notas de crédito, control de caja y arqueo diario.',
        tags: ['POS', 'Factura E.', 'Caja', 'IGV'],
        color: '#6366f1',
        featured: false,
    },
    {
        icon: '🏨',
        title: 'Gestión de Hoteles',
        desc: 'Reservas, check-in/out, habitaciones, tarifas temporada, housekeeping y reportes de ocupación.',
        tags: ['Reservas', 'Check-in', 'Habitaciones', 'Tarifas'],
        color: '#8b5cf6',
        featured: false,
    },
    {
        icon: '📋',
        title: 'Proyectos & Obras',
        desc: 'Planificación, cronograma de actividades, presupuestos, avance de obra y control de recursos por proyecto.',
        tags: ['Cronograma', 'Presupuesto', 'Avance', 'Recursos'],
        color: '#f59e0b',
        featured: false,
    },
    {
        icon: '📦',
        title: 'Inventario & Almacén',
        desc: 'Control de stock, entradas y salidas, kardex valorado, múltiples almacenes y alertas de stock mínimo.',
        tags: ['Stock', 'Kardex', 'Almacenes', 'Alertas'],
        color: '#10b981',
        featured: false,
    },
    {
        icon: '👥',
        title: 'Control de Personal',
        desc: 'Asistencia, planillas, vacaciones, contratos, documentos y reportes de productividad por empleado.',
        tags: ['Asistencia', 'Planilla', 'Contratos', 'RRHH'],
        color: '#ec4899',
        featured: false,
    },
    {
        icon: '🏦',
        title: 'Contabilidad & Finanzas',
        desc: 'Libro contable, estados financieros, flujo de caja, centro de costos e integración con SUNAT.',
        tags: ['Balance', 'SUNAT', 'Costos', 'Flujo Caja'],
        color: '#14b8a6',
        featured: false,
    },
    {
        icon: '🛒',
        title: 'Compras & Proveedores',
        desc: 'Órdenes de compra, cotizaciones, recepción de mercadería y gestión de proveedores con historial.',
        tags: ['O/C', 'Cotizaciones', 'Proveedores', 'Recepción'],
        color: '#f97316',
        featured: false,
    },
    {
        icon: '📊',
        title: 'Reportes & Analítica',
        desc: 'Dashboard ejecutivo, KPIs en tiempo real, exportación a Excel/PDF y gráficos interactivos por módulo.',
        tags: ['Dashboard', 'Excel', 'PDF', 'KPIs'],
        color: '#a78bfa',
        featured: false,
    },
]

const benefits = [
    { icon: '⚡', text: 'Velocidad y rendimiento', sub: 'Respuestas instantáneas, sin tiempos de espera', color: '#f59e0b' },
    { icon: '🔐', text: 'Seguridad empresarial', sub: 'JWT, roles y permisos granulares por módulo', color: '#0ea5e9' },
    { icon: '☁️', text: 'Acceso desde cualquier lugar', sub: 'Web responsive, funciona en PC, tablet y móvil', color: '#6366f1' },
    { icon: '🔄', text: 'Actualizaciones continuas', sub: 'Mejoras constantes sin costo adicional', color: '#10b981' },
]

const dashCards = [
    { label: 'Ventas hoy', val: 'S/ 4.2K', change: '+12%', color: '#0ea5e9' },
    { label: 'Clientes', val: '1,284', change: '+8%', color: '#6366f1' },
    { label: 'Cobranzas', val: 'S/ 9.1K', change: '+21%', color: '#10b981' },
]

const chartBars = [35, 55, 42, 70, 60, 80, 65, 90, 75, 88, 95, 78]

const tableRows = [
    { name: 'Créditos activos', status: '↑ +5 hoy', color: '#0ea5e9' },
    { name: 'Stock crítico', status: '3 items', color: '#f59e0b' },
    { name: 'Reservas hotel', status: '↑ 12 pend.', color: '#8b5cf6' },
]
</script>