## Database Design

![](https://i.imgur.com/2B50qq0.png)

## Application Flow

Untuk data user, dokter, product dan klinik bisa dijalankan dengam menggunakan seeder, alangkah baiknya sebelum anda menjalankan aplikasi ini jalankan terlebih dahulu migration databasenya dengan cara `make trun` dan untuk seeder `make tseed`, perlu di ingat aplikasi ini tidak ada authentication dan authorization jadi untuk process pemberian `userId` atau `recipeId` semua dilakukan secara manual melalui postman, untuk mendapatkan resultnya.

## User Flow

- 1. User dapat membuat recipe, kemudian ketika user berhasil membuat recipe maka status recipe adalah created
- 2. User dapat menambahkan obat kedalam recipe, yang telah dibuat sebelumnya
- 3. User dapat melihat list & detail recipe yang telah dibuat dan user juga dapat melihat list product apa saja yang tersedia
- 4. User dapat melakukan confirm/cancelled terkait recipe yang telah dibuat sebelumnya, jika statusnya confirm maka product yang ada saat ini akan di kurangi dari product yang telah ditambahkan kedalam recipe, begitu juga jika status nya cancelled maka product yang ada saat ini akan di kembalikan seperti semula, dari product yang telah ditambahkan sebelumnya kedalam recipe.

## Doctor Flow

- 1. Dokter dapat melihat recipe yang telah ditambahkan oleh user, sesuai dengan dokter yang telah dipilih oleh user
- 2. Dokter dapat melihat detail recipe yang telah ditambahkan oleh user, sesuai dengan dokter yang telah dipilih oleh user
- 3. Dokter dapat menambahkan recipe detail, jika status dari recipe yang telah dibuat user adalah confirmed