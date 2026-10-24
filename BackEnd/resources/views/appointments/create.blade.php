<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>QLess - Hospital Queue</title>
</head>
<body>

    @if(session('success'))
        <div style="color: green; font-weight: bold;">
            {{ session('success') }}
        </div>
    @endif

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('appointments.store') }}">
        @csrf

        <label>Nama Lengkap</label>
        <input type="text" name="patient_name" value="{{ old('patient_name') }}" required>

        <label>Nomor Telepon</label>
        <input type="text" name="patient_phone" value="{{ old('patient_phone') }}" required>

        <label>Departemen</label>
        <select name="department_id" required>
            <option value="">Pilih Departemen</option>
            @foreach ($departments as $department)
                <option value="{{ $department->id }}" @selected(old('department_id') == $department->id)>
                    {{ $department->name }}
                </option>
            @endforeach
        </select>

        <label>Dokter (Opsional)</label>
        <select name="doctor_id">
            <option value="">Pilih Dokter</option>
            @foreach ($departments as $department)
                @foreach ($department->doctors as $doctor)
                    <option value="{{ $doctor->id }}" @selected(old('doctor_id') == $doctor->id)>
                        {{ $doctor->name }} ({{ $department->name }})
                    </option>
                @endforeach
            @endforeach
        </select>

        <label>Tanggal Janji Temu</label>
        <input type="date" name="appointment_date" min="{{ date('Y-m-d') }}" value="{{ old('appointment_date') }}" required>

        <label>Waktu Jam</label>
        <input type="time" name="appointment_time" value="{{ old('appointment_time') }}" required>

        <button type="submit">Ajukan Booking</button>
    </form>

</body>
</html>