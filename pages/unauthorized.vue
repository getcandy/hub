<template>
    <div>
        Unauthorised
    </div>
</template>

<script>
export default {
    layout: 'auth',
    middleware( {store, redirect}) {
        return true;
    }
}
</script>