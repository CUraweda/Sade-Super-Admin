import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import marker1 from "../assets/marker1.png";
import L from "leaflet";
import Swal from "sweetalert2";

interface Location {
  id: number;
  nama: string;
  lat: number;
  lng: number;
  radius: number;
}

interface EditLocation {
  id?: number; // Make id optional
  nama: string;
  lat: number;
  lng: number;
  radius: number;
}

const LokasiAbsen = () => {
  const DEFAULT_LAT = -6.406390697597822;
  const DEFAULT_LNG = 106.81663513183595;
  const [editLocation, setEditLocation] = useState<EditLocation>({
    nama: "",
    lat: 0,
    lng: 0,
    radius: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_BASE_API_URL}api/location`
      );
      setLocations(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Lokasi Absen, silakan refresh halaman!",
      });
      console.error("Error fetching locations:", error);
    }
  };
  useEffect(() => {
    fetchLocations();
  }, []);

  const [errors, setErrors] = useState({ nama: "", radius: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditLocation((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { nama: "", radius: "" };
    let isValid = true;

    if (!editLocation.nama.trim()) {
      newErrors.nama = "Nama Lokasi wajib diisi";
      isValid = false;
    }

    if (!editLocation.radius || editLocation.radius <= 0) {
      newErrors.radius = "Radius wajib diisi dan harus lebih besar dari 0";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_REACT_BASE_API_URL}/api/location/update`,
          {
            id: editLocation.id,
            nama: editLocation.nama,
            lat: editLocation.lat,
            lng: editLocation.lng,
            radius: editLocation.radius,
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_REACT_BASE_API_URL}/api/location/create`,
          {
            nama: editLocation.nama,
            lat: editLocation.lat,
            lng: editLocation.lng,
            radius: editLocation.radius,
          }
        );
      }
      setShowModal(false);
      setEditLocation({ nama: "", lat: 0, lng: 0, radius: 0 });
      setIsEditing(false);
      fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleAddClick = () => {
    setEditLocation({
      nama: "",
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG,
      radius: 0,
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditClick = (location: Location) => {
    setEditLocation({
      id: location.id,
      nama: location.nama,
      lat: location.lat,
      lng: location.lng,
      radius: location.radius,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const handleDeleteClick = async () => {
    if (locationToDelete !== null) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_BASE_API_URL}/api/location/delete`,
          {
            data: { id: locationToDelete },
          }
        );
        fetchLocations();
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting location:", error);
      }
    }
  };

  const openDeleteModal = (id: number) => {
    setLocationToDelete(id);
    setShowDeleteModal(true);
  };

  // const handleDeleteClick = async (id: number) => {
  //   if (window.confirm("Apakah Anda yakin ingin menghapus lokasi ini?")) {
  //     try {
  //       await axios.delete(`${import.meta.env.VITE_REACT_BASE_API_URL}/api/location/delete`, {
  //         data: { id }
  //       });
  //       fetchLocations();
  //     } catch (error) {
  //       console.error('Error deleting location:', error);
  //     }
  //   }
  // };
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setEditLocation((prev) => ({
      ...prev,
      lat: lat,
      lng: lng,
    }));
  };

  function MapClickHandler({
    onMapClick,
  }: {
    onMapClick: (e: L.LeafletMouseEvent) => void;
  }) {
    useMapEvents({
      click: onMapClick,
    });
    return null;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Daftar Lokasi Presensi</span>
        <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md ">
          <div className="w-full flex justify-end my-4 gap-2 items-center">
            {/* <label className="input input-sm input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label> */}

            <div className="join">
              <button
                onClick={handleAddClick}
                className="btn btn-ghost maxw400:hidden bg-blue-500 btn-sm text-white"
              >
                <FaPlus /> Tambah
              </button>
              <button
                onClick={handleAddClick}
                className="btn btn-ghost hidden maxw400:inline bg-blue-500 btn-sm text-white"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <table className="table min-w-[500px] table-zebra table-sm">
            <thead className="bg-blue-300">
              <tr>
                <th className="max-w-1">No</th>
                <th className="max-w-20">Nama Lokasi</th>
                <th className="w-1/2">Lokasi</th>
                <th className="max-w-20">Radius</th>
                <th className="max-w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                <tr key={location.id}>
                  <td className="max-w-1">{index + 1}</td>
                  <td className="max-w-20">{location.nama}</td>
                  <td className="w-1/2 z-0 relative">
                    <MapContainer
                      center={[location.lat, location.lng]}
                      zoom={13}
                      style={{ height: "40vh", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[location.lat, location.lng]}
                        icon={
                          new L.Icon({
                            iconUrl: marker1,
                            iconSize: [50, 50],
                            iconAnchor: [25, 48],
                          })
                        }
                      />
                      <Circle
                        center={[location.lat, location.lng]}
                        radius={location.radius}
                      />
                    </MapContainer>
                  </td>
                  <td className="max-w-20">{location.radius}</td>
                  <td className="max-w-20">
                    <button
                      className="btn btn-ghost btn-sm text-blue-500 text-xl mr-2"
                      onClick={() => handleEditClick(location)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-red-500 text-xl"
                      onClick={() => openDeleteModal(location.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
            onNextClick={() => handleFilter("page", pageMeta.page + 1)}
            onLimitChange={(value) => handleFilter("limit", value)}
            /> */}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-3xl overflow-hidden">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Lokasi Presensi" : "Tambah Lokasi Presensi"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Lokasi</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={editLocation?.nama || ""}
                  onChange={handleInputChange}
                  placeholder="Nama Lokasi"
                  className="input input-bordered w-full mb-2"
                />
                {errors.nama && (
                  <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                )}
              </div>
              <div className="form-control">
                <label className="flex justify-between px-[4px] py-[8px]  maxw640:flex-col">
                  <span className="label-text">Lokasi</span>
                  <span className="label-text opacity-80">
                    (Klik peta untuk memilih)
                  </span>
                </label>
                <div className="mb-1">
                  <MapContainer
                    center={[editLocation.lat || 0, editLocation.lng || 0]}
                    zoom={13}
                    style={{ height: "40vh", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapClickHandler onMapClick={handleMapClick} />
                    <Marker
                      position={[editLocation.lat || 0, editLocation.lng || 0]}
                      icon={
                        new L.Icon({
                          iconUrl: marker1,
                          iconSize: [50, 50],
                          iconAnchor: [25, 48],
                        })
                      }
                      draggable={true}
                      eventHandlers={{
                        dragend: (e) => {
                          const marker = e.target;
                          const position = marker.getLatLng();
                          setEditLocation((prev) => ({
                            ...prev,
                            lat: position.lat,
                            lng: position.lng,
                          }));
                        },
                      }}
                    />
                    <Circle
                      center={[editLocation.lat || 0, editLocation.lng || 0]}
                      radius={editLocation.radius || 0}
                    />
                  </MapContainer>
                </div>
                <div className="flex mb-2 maxw640:flex-col gap-4  maxw640:gap-0">
                  <div className="flex items-center w-fit">
                    <span>Lat:</span>
                    <span className="ml-3">{editLocation.lat}</span>

                    {/* <input
                      type="number"
                      name="lat"
                      value={editLocation.lat}
                      onChange={handleInputChange}
                      placeholder="Latitude"
                      className="ml-3"
                      readOnly
                    /> */}
                  </div>
                  <div></div>
                  <div className="flex items-center w-fit">
                    <span>Lng:</span>
                    <span className="ml-3">{editLocation.lng}</span>
                    {/* <input
                      type="number"
                      name="lng"
                      value={editLocation.lng}
                      onChange={handleInputChange}
                      placeholder="Longitude"
                      className="ml-5 w-[170px]"
                      readOnly
                    /> */}
                  </div>
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Radius Lokasi</span>
                </label>
                <input
                  type="number"
                  name="radius"
                  value={editLocation.radius}
                  onChange={handleInputChange}
                  placeholder="Radius"
                  className="input input-bordered w-full mb-4"
                />
                {errors.radius && (
                  <p className="text-red-500 text-sm mt-1">{errors.radius}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">
              Apakah Anda yakin ingin menghapus lokasi ini?
            </h2>
            <div className="flex justify-end">
              <button
                className="btn btn-ghost mr-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleDeleteClick}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LokasiAbsen;
