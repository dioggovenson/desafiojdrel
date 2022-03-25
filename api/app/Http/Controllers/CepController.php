<?php

namespace App\Http\Controllers;

use App\Models\Cep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CepController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(Cep::all(), Response::HTTP_OK);
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $cep)
    {
        $cep = preg_replace("/[^0-9]/", "", $cep);

        $cepDb = Cep::where('cep', $cep)->first();
        if (isset($cepDb)) {
            return response()->json([
                'id' => $request->body,
                'cep' => $cepDb->cep,
                'logradouro' => $cepDb->logradouro,
                'complemento' => $cepDb->complemento,
                'bairro' => $cepDb->bairro,
                'localidade' => $cepDb->localidade,
                'uf' => $cepDb->uf,
                'ibge' => $cepDb->ibge,
                'gia' => $cepDb->gia,
                'ddd' => $cepDb->ddd,
                'siafi' => $cepDb->siafi
            ], 200, ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'], JSON_UNESCAPED_UNICODE);
        } else {
            $viacep = "https://viacep.com.br/ws/{$cep}/json/";
            $response = json_decode(file_get_contents($viacep));

            if (isset($response->erro)) {
                return response()->json(['message' => 'CEP Inexistente', 'status' => 'error'], 200, ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'], JSON_UNESCAPED_UNICODE);
            } else {
                $newCep = new Cep();
                $newCep->cep = $cep;
                $newCep->logradouro = $response->logradouro;
                $newCep->complemento = $response->complemento;
                $newCep->bairro = $response->bairro;
                $newCep->localidade = $response->localidade;
                $newCep->uf = $response->uf;
                $newCep->ibge = $response->ibge;
                $newCep->gia = $response->gia;
                $newCep->ddd = $response->ddd;
                $newCep->siafi = $response->siafi;
                $newCep->save();

                return response()->json([
                    'cep' => $cep,
                    'logradouro' => $response->logradouro,
                    'complemento' => $response->complemento,
                    'bairro' => $response->bairro,
                    'localidade' => $response->localidade,
                    'uf' => $response->uf,
                    'ibge' => $response->ibge,
                    'gia' => $response->gia,
                    'ddd' => $response->ddd,
                    'siafi' => $response->siafi
                ], 200, ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'], JSON_UNESCAPED_UNICODE);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $cep): JsonResponse
    {
        $search = Cep::where('cep', $cep)->first();
        $search->update($request->only('user_id', 'zipcode_searched', 'created_at', 'grade', 'feedback'));

        return response()->json($search, Response::HTTP_ACCEPTED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $search = Cep::findOrFail($id);
        $search->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
